import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { IRepositoryState, GitCommandResponse } from '@/types/git';

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
      queryClient.setQueryData<GitCommandResponse[]>(['terminal-responses'], (old = []) => [
        ...old,
        { ...data, command }
      ]);
    },
    onError: (error, command) => {
      // Add error to terminal responses cache
      const errorResponse: GitCommandResponse = {
        success: false,
        output: error instanceof Error ? error.message : 'Unknown error',
        repositoryState: null,
        command,
      };
      queryClient.setQueryData<GitCommandResponse[]>(['terminal-responses'], (old = []) => [
        ...old,
        errorResponse
      ]);
    },
  });
};

export const useRepositoryState = () => {
  return useQuery<IRepositoryState | null>({
    queryKey: ['git', 'state'],
    queryFn: () => gitEngineApi.getRepositoryState(),
  });
};

// Hook to get terminal responses from cache
export const useTerminalResponses = () => {
  return useQuery<GitCommandResponse[]>({
    queryKey: ['terminal-responses'],
    queryFn: () => [],
    initialData: [],
  });
};

export const useGitEngine = () => {
  const { mutateAsync: runCommand, isPending: isRunning } = useExecuteGitCommand();
  const { data: responses = [] } = useTerminalResponses();
  return { responses, runCommand, isRunning };
};


