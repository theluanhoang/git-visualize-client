import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LessonFormData, LessonUpdateData } from '@/lib/schemas/lesson';
import { LessonsService } from '@/services/lessons';
import { lessonKeys } from '@/lib/react-query/query-keys';

const lessonsApi = {
  getAll: async () => {
    return [
      {
        id: 1,
        title: 'Git Basics - Introduction',
        slug: 'git-basics-introduction',
        description: 'Học những khái niệm cơ bản về Git và version control',
        status: 'published',
        views: 245,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        author: 'Admin',
        sections: 4,
        estimatedTime: '30 phút'
      },
    ];
  },
  
  getById: async (id: string) => {
    return {
      id,
      title: 'Git Basics - Introduction',
      slug: 'git-basics-introduction',
      description: 'Học những khái niệm cơ bản về Git và version control',
      content: '<p>Nội dung bài học...</p>',
      status: 'published',
      prerequisites: [],
      estimatedTime: '30 phút',
      difficulty: 'beginner',
      tags: ['git', 'basics'],
      featured: false,
      allowComments: true
    };
  },
  
  create: async (data: LessonFormData) => {
    return LessonsService.create(data);
  },
  
  update: async (id: string, data: LessonUpdateData) => {
    return LessonsService.update(id, data);
  },
  
  delete: async (id: string) => {
    return LessonsService.delete(id);
  }
};

export const useLessons = (params: {
  limit?: number;
  offset?: number;
  id?: string;
  slug?: string;
  status?: 'draft' | 'published' | 'archived';
  q?: string;
  includePractices?: boolean;
} = {}) => {
  return useQuery({
    queryKey: lessonKeys.list(params),
    queryFn: async () => {
      const res = await LessonsService.getAll(params);
      return res.data;
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LessonUpdateData }) => 
      lessonsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      queryClient.invalidateQueries({ queryKey: lessonKeys.detail(id) });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lessonsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
    },
  });
};
