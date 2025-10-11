import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { IRepositoryState, GitCommandResponse } from '@/types/git';

// Storage key for terminal responses
const TERMINAL_RESPONSES_KEY = 'git-terminal-responses';

// Utility functions for terminal persistence
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
      // Add to terminal responses cache
      const oldResponses = queryClient.getQueryData<GitCommandResponse[]>(['terminal-responses']) || [];
      const newResponses = [...oldResponses, { ...data, command }];
      
      queryClient.setQueryData<GitCommandResponse[]>(['terminal-responses'], newResponses);
      
      // Persist to localStorage
      saveTerminalResponses(newResponses);
    },
    onError: (error, command) => {
      // Add error to terminal responses cache
      const errorResponse: GitCommandResponse = {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error',
        repositoryState: null,
        command,
      };
      const oldResponses = queryClient.getQueryData<GitCommandResponse[]>(['terminal-responses']) || [];
      const newResponses = [...oldResponses, errorResponse];
      
      queryClient.setQueryData<GitCommandResponse[]>(['terminal-responses'], newResponses);
      
      // Persist to localStorage
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

// Initialize terminal responses from localStorage immediately
const initializeTerminalResponses = () => {
  try {
    const savedResponses = JSON.parse(localStorage.getItem(TERMINAL_RESPONSES_KEY) || '[]');
    return savedResponses;
  } catch (error) {
    console.warn('Failed to initialize terminal responses:', error);
    return [];
  }
};

// Hook to get terminal responses from cache with persistence
export const useTerminalResponses = () => {
  const queryClient = useQueryClient();
  
  return useQuery<GitCommandResponse[]>({
    queryKey: ['terminal-responses'],
    queryFn: () => {
      // Load from localStorage on first load
      const savedResponses = JSON.parse(localStorage.getItem(TERMINAL_RESPONSES_KEY) || '[]');
      
      // Set initial data in cache
      queryClient.setQueryData(['terminal-responses'], savedResponses);
      
      return savedResponses;
    },
    initialData: initializeTerminalResponses(), // Initialize with saved data immediately
    staleTime: Infinity, // Never consider stale since it's persisted
    gcTime: Infinity, // Never garbage collect
  });
};

// Initialize app data on startup
export const initializeAppData = () => {
  const savedResponses = JSON.parse(localStorage.getItem(TERMINAL_RESPONSES_KEY) || '[]');
  return savedResponses;
};

export const useGitEngine = () => {
  const { mutateAsync: runCommand, isPending: isRunning } = useExecuteGitCommand();
  const { data: responses = [] } = useTerminalResponses();
  
  const clearAllData = () => {
    const queryClient = useQueryClient();
    queryClient.setQueryData(['terminal-responses'], []);
    queryClient.setQueryData(['git', 'state'], null);
    localStorage.removeItem(TERMINAL_RESPONSES_KEY);
    localStorage.removeItem('git-repository-state');
    localStorage.removeItem('git-commit-graph-node-positions');
  };
  
  return { responses, runCommand, isRunning, clearAllData };
};


