import { gitEngine } from "@/services/git-engine";
import { GitCommandResponse } from "@/types/git";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GIT_RESPONSES_KEY } from "../queries/useGitResponses";

export const useGitCommandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (command: string): Promise<GitCommandResponse> => {
      const response = await gitEngine.executeGitCommand(command);
      return { ...response, command };
    },
    onSuccess: (newResponse, command) => {
      queryClient.setQueryData<GitCommandResponse[]>(GIT_RESPONSES_KEY, (old = []) => [
        ...old,
        {
            ...newResponse,
            command
        },
      ]);
    },
    onError: (error, command) => {
      queryClient.setQueryData<GitCommandResponse[]>(GIT_RESPONSES_KEY, (old = []) => [
        ...old,
        {
          success: false,
          output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          repositoryState: null,
          command
        },
      ]);
    },
  });
};