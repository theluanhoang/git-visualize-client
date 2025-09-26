import { GitCommandResponse } from "@/types/git";
import { useQuery } from "@tanstack/react-query";

export const GIT_RESPONSES_KEY = ['gitResponses'];

export const useGitResponses = () => {
  return useQuery<GitCommandResponse[]>({
    queryKey: GIT_RESPONSES_KEY,
    queryFn: async () => {
      return [];
    },
    initialData: [],
  });
};