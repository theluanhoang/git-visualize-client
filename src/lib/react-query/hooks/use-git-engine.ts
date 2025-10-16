import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
import { IRepositoryState, GitCommandResponse } from '@/types/git';
import { PracticeRepoStateService } from '@/services/practiceRepositoryState';

const terminalKeyFor = (practiceId?: string) => practiceId ? `git-terminal-responses:${practiceId}` : 'git-terminal-responses';

const saveTerminalResponses = (responses: GitCommandResponse[], practiceId?: string) => {
  try {
    localStorage.setItem(terminalKeyFor(practiceId), JSON.stringify(responses));
  } catch (error) {
    console.warn('Failed to save terminal responses:', error);
  }
};

export const gitEngineApi = {
  executeGitCommand: async (command: string, repositoryState?: IRepositoryState | null) => {
    const res = await api.post<GitCommandResponse>('/api/v1/git/execute', { command, repositoryState });
    return res.data;
  },
  getRepositoryState: async () => {
    const res = await api.get<IRepositoryState>('/api/v1/git/state');
    return res.data;
  },
};

export const useExecuteGitCommand = (practiceId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<GitCommandResponse, unknown, string>({
    mutationFn: (command: string) => {
      const currentState = queryClient.getQueryData<IRepositoryState | null>(['git', 'state', practiceId ?? 'global']);
      return gitEngineApi.executeGitCommand(command, currentState ?? null);
    },
    onSuccess: (data, command) => {
      const key = ['terminal-responses', practiceId ?? 'global'] as const;
      const oldResponses = queryClient.getQueryData<GitCommandResponse[]>(key) || [];
      const newResponses = [...oldResponses, { ...data, command }];
      
      queryClient.setQueryData<GitCommandResponse[]>(key, newResponses);
      
      if (data.repositoryState) {
        queryClient.setQueryData(['git', 'state', practiceId ?? 'global'], data.repositoryState);
      }
      
      saveTerminalResponses(newResponses, practiceId);
      if (practiceId && data.repositoryState) {
        const currentVersion = queryClient.getQueryData<number>(['git', 'state-version', practiceId]) || 0;
        PracticeRepoStateService.upsert(practiceId, { state: data.repositoryState, version: currentVersion }).then((res) => {
          queryClient.setQueryData(['git', 'state-version', practiceId], res.version);
        }).catch((err) => {
          console.warn('Failed to upsert practice repo state:', err);
        });
      }
    },
    onError: (error, command) => {
      const errorResponse: GitCommandResponse = {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error',
        repositoryState: null,
        command,
      };
      const key = ['terminal-responses', practiceId ?? 'global'] as const;
      const oldResponses = queryClient.getQueryData<GitCommandResponse[]>(key) || [];
      const newResponses = [...oldResponses, errorResponse];
      
      queryClient.setQueryData<GitCommandResponse[]>(key, newResponses);
      
      saveTerminalResponses(newResponses, practiceId);
    },
  });
};

export const useRepositoryState = (practiceId?: string) => {
  const queryClient = useQueryClient();
  return useQuery<IRepositoryState | null>({
    queryKey: ['git', 'state', practiceId ?? 'global'],
    queryFn: async () => {
      if (practiceId) {
        const server = await PracticeRepoStateService.get(practiceId);
        queryClient.setQueryData(['git', 'state-version', practiceId], server.version);
        return server.state;
      }
      return gitEngineApi.getRepositoryState();
    },
  });
};

const initializeTerminalResponses = (practiceId?: string) => {
  try {
    const savedResponses = JSON.parse(localStorage.getItem(terminalKeyFor(practiceId)) || '[]');
    return savedResponses;
  } catch (error) {
    console.warn('Failed to initialize terminal responses:', error);
    return [];
  }
};

export const useTerminalResponses = (practiceId?: string) => {
  const queryClient = useQueryClient();
  
  const [data, setData] = useState<GitCommandResponse[]>([]);
  
  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem(terminalKeyFor(practiceId)) || '[]');
    
    setData(savedResponses);
    
    queryClient.setQueryData(['terminal-responses', practiceId ?? 'global'], savedResponses);
  }, [queryClient, practiceId]);
  
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === 'terminal-responses') {
        const key = ['terminal-responses', practiceId ?? 'global'] as const;
        const newData = queryClient.getQueryData<GitCommandResponse[]>(key) || [];
        setData(newData);
      }
    });
    
    return unsubscribe;
  }, [queryClient, practiceId]);
  
  return {
    data,
    isLoading: false,
    error: null,
    refetch: () => {
      const savedResponses = JSON.parse(localStorage.getItem(terminalKeyFor(practiceId)) || '[]');
      queryClient.setQueryData(['terminal-responses', practiceId ?? 'global'], savedResponses);
      setData(savedResponses);
    }
  };
};

export const useGoalTerminalResponses = () => {
  const queryClient = useQueryClient();
  
  return useQuery<GitCommandResponse[]>({
    queryKey: ['goal-terminal-responses'],
    queryFn: () => {
      return [];
    },
    initialData: [], // Start with empty data
    staleTime: Infinity, // Never consider stale
    gcTime: Infinity, // Never garbage collect
  });
};

export const initializeAppData = (practiceId?: string) => {
  const savedResponses = JSON.parse(localStorage.getItem(terminalKeyFor(practiceId)) || '[]');
  return savedResponses;
};

export const useGitEngine = (practiceId?: string) => {
  const { mutateAsync: runCommand, isPending: isRunning } = useExecuteGitCommand(practiceId);
  const { data: responses = [] } = useTerminalResponses(practiceId);
  const queryClient = useQueryClient();
  
  const clearAllData = () => {
    localStorage.removeItem(terminalKeyFor(practiceId));
    localStorage.removeItem('git-repository-state');
    localStorage.removeItem('git-commit-graph-node-positions');
    
    queryClient.setQueryData(['terminal-responses', practiceId ?? 'global'], []);
    queryClient.setQueryData(['git', 'state', practiceId ?? 'global'], null);
    
    queryClient.invalidateQueries({ queryKey: ['terminal-responses', practiceId ?? 'global'] });
    queryClient.invalidateQueries({ queryKey: ['git', 'state', practiceId ?? 'global'] });
  };
  
  return { responses, runCommand, isRunning, clearAllData };
};
