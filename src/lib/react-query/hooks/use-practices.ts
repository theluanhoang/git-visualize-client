import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PracticesService, GetPracticesQuery } from '@/services/practices';

export const usePractices = (query: GetPracticesQuery = {}) => {
  return useQuery({
    queryKey: ['practices', query],
    queryFn: () => PracticesService.getPractices(query),
  });
};

export const useIncrementViews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PracticesService.incrementViews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['practices'] });
      queryClient.invalidateQueries({ queryKey: ['practices', id] });
    },
  });
};

export const useIncrementCompletions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PracticesService.incrementCompletions(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['practices'] });
      queryClient.invalidateQueries({ queryKey: ['practices', id] });
    },
  });
};
