import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '@/lib/api/axios';
import { IRepositoryState, GitCommandResponse } from '@/types/git';

const TERMINAL_RESPONSES_KEY = 'git-terminal-responses';

const saveTerminalResponses = (responses: GitCommandResponse[]) => {
  try {
    localStorage.setItem(TERMINAL_RESPONSES_KEY, JSON.stringify(responses));
  } catch (error) {
    console.warn('Failed to save terminal responses:', error);
  }
};

export const gitEngineApi = {
  executeGitCommand: async (command: string) => {
    const res = await api.post<GitCommandResponse>('/api/v1/git/execute', { command });
    return res.data;
  },
  getRepositoryState: async () => {
    const res = await api.get<IRepositoryState>('/api/v1/git/state');
    return res.data;
  },
};

export const useExecuteGitCommand = () => {
  const queryClient = useQueryClient();
  
  return useMutation<GitCommandResponse, unknown, string>({
    mutationFn: (command: string) => gitEngineApi.executeGitCommand(command),
    onSuccess: (data, command) => {
      const oldResponses = queryClient.getQueryData<GitCommandResponse[]>(['terminal-responses']) || [];
      const newResponses = [...oldResponses, { ...data, command }];
      
      queryClient.setQueryData<GitCommandResponse[]>(['terminal-responses'], newResponses);
      
      if (data.repositoryState) {
        queryClient.setQueryData(['git', 'state'], data.repositoryState);
      }
      
      saveTerminalResponses(newResponses);
    },
    onError: (error, command) => {
      const errorResponse: GitCommandResponse = {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error',
        repositoryState: null,
        command,
      };
      const oldResponses = queryClient.getQueryData<GitCommandResponse[]>(['terminal-responses']) || [];
      const newResponses = [...oldResponses, errorResponse];
      
      queryClient.setQueryData<GitCommandResponse[]>(['terminal-responses'], newResponses);
      
      saveTerminalResponses(newResponses);
    },
  });
};

export const useRepositoryState = () => {
  return useQuery<IRepositoryState | null>({
    queryKey: ['git', 'state'],
    queryFn: () => gitEngineApi.getRepositoryState(),
  });
};

const initializeTerminalResponses = () => {
  try {
    const savedResponses = JSON.parse(localStorage.getItem(TERMINAL_RESPONSES_KEY) || '[]');
    return savedResponses;
  } catch (error) {
    console.warn('Failed to initialize terminal responses:', error);
    return [];
  }
};

export const useTerminalResponses = () => {
  const queryClient = useQueryClient();
  
  const [data, setData] = useState<GitCommandResponse[]>([]);
  
  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem(TERMINAL_RESPONSES_KEY) || '[]');
    
    setData(savedResponses);
    
    queryClient.setQueryData(['terminal-responses'], savedResponses);
  }, [queryClient]);
  
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === 'terminal-responses') {
        const newData = queryClient.getQueryData<GitCommandResponse[]>(['terminal-responses']) || [];
        setData(newData);
      }
    });
    
    return unsubscribe;
  }, [queryClient]);
  
  return {
    data,
    isLoading: false,
    error: null,
    refetch: () => {
      const savedResponses = JSON.parse(localStorage.getItem(TERMINAL_RESPONSES_KEY) || '[]');
      queryClient.setQueryData(['terminal-responses'], savedResponses);
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

export const initializeAppData = () => {
  const savedResponses = JSON.parse(localStorage.getItem(TERMINAL_RESPONSES_KEY) || '[]');
  return savedResponses;
};

export const useGitEngine = () => {
  const { mutateAsync: runCommand, isPending: isRunning } = useExecuteGitCommand();
  const { data: responses = [] } = useTerminalResponses();
  const queryClient = useQueryClient();
  
  const clearAllData = () => {
    localStorage.removeItem(TERMINAL_RESPONSES_KEY);
    localStorage.removeItem('git-repository-state');
    localStorage.removeItem('git-commit-graph-node-positions');
    
    queryClient.setQueryData(['terminal-responses'], []);
    queryClient.setQueryData(['git', 'state'], null);
    
    queryClient.invalidateQueries({ queryKey: ['terminal-responses'] });
    queryClient.invalidateQueries({ queryKey: ['git', 'state'] });
  };
  
  return { responses, runCommand, isRunning, clearAllData };
};
