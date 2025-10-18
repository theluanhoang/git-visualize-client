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
  buildGoalRepositoryState: async (commands: string[]) => {
    let currentState: IRepositoryState | null = null;
    
    for (const command of commands) {
      try {
        const response = await gitEngineApi.executeGitCommand(command, currentState);
        if (response.repositoryState) {
          currentState = response.repositoryState;
        }
      } catch (error) {
        console.warn(`Failed to execute command "${command}":`, error);
      }
    }
    
    return { repositoryState: currentState };
  }
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
    initialData: [],
    staleTime: Infinity, 
    gcTime: Infinity,
  });
};

export const initializeAppData = (practiceId?: string) => {
  const savedResponses = JSON.parse(localStorage.getItem(terminalKeyFor(practiceId)) || '[]');
  return savedResponses;
};

export const useBuildGoalRepositoryState = (commands: string[], enabled: boolean = true) => {
  return useQuery({
    queryKey: ['git', 'goal-state', commands],
    queryFn: () => gitEngineApi.buildGoalRepositoryState(commands),
    enabled: enabled && commands.length > 0,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: 1,
    retryDelay: 1000,
  });
};

export const useGitEngine = (practiceId?: string) => {
  const { mutateAsync: runCommand, isPending: isRunning } = useExecuteGitCommand(practiceId);
  const { data: responses = [] } = useTerminalResponses(practiceId);
  const queryClient = useQueryClient();
  
  const syncFromServer = async () => {
    if (!practiceId) return;
    const server = await PracticeRepoStateService.get(practiceId);
    queryClient.setQueryData(['git', 'state', practiceId], server.state);
    queryClient.setQueryData(['git', 'state-version', practiceId], server.version || 0);
    const mockResponses: GitCommandResponse[] = server.state ? [
      {
        repositoryState: server.state,
        command: 'sync-from-server',
        success: true,
        output: 'Synchronized repository state from server'
      }
    ] : [];
    queryClient.setQueryData(['terminal-responses', practiceId], mockResponses);
    try { localStorage.setItem(`git-terminal-responses:${practiceId}`, JSON.stringify(mockResponses)); } catch {}
  };

  const clearAllData = async () => {
    if (practiceId) {
      try {
        await PracticeRepoStateService.remove(practiceId);
      } catch (e) {
        console.warn('Practice repo state remove failed (continuing):', e);
      }
    }

    try { localStorage.removeItem(terminalKeyFor(practiceId)); } catch {}
    try { localStorage.removeItem(practiceId ? `git-commit-graph-node-positions:${practiceId}` : 'git-commit-graph-node-positions'); } catch {}
    try { localStorage.removeItem('git-repository-state'); } catch {}

    queryClient.setQueryData(['terminal-responses', practiceId ?? 'global'], []);
    queryClient.setQueryData(['git', 'state', practiceId ?? 'global'], null);
    if (practiceId) {
      queryClient.setQueryData(['git', 'state-version', practiceId], 0);
    }
    queryClient.invalidateQueries({ queryKey: ['terminal-responses', practiceId ?? 'global'] });
    queryClient.invalidateQueries({ queryKey: ['git', 'state', practiceId ?? 'global'] });
  };
  
  return { responses, runCommand, isRunning, clearAllData, syncFromServer };
};
