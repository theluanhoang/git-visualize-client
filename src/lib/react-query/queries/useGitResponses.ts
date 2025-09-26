import { GitCommandResponse } from "@/types/git";
import { useQuery } from "@tanstack/react-query";

export const GIT_RESPONSES_KEY = ['gitResponses'];

export const useGitResponses = () => {
  return useQuery<GitCommandResponse[]>({
    queryKey: GIT_RESPONSES_KEY,
    queryFn: async () => {
      return [];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    gcTime: 1000 * 60 * 60 * 24,
    staleTime: Infinity,
  });
};