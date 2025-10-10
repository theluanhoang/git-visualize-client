import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LessonFormData, LessonUpdateData } from '@/lib/schemas/lesson';
import { LessonsService } from '@/services/lessons';

// Mock API functions - replace with actual API calls
const lessonsApi = {
  getAll: async () => {
    // Mock data
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
      // ... more mock data
    ];
  },
  
  getById: async (id: number) => {
    // Mock data
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
  
  update: async (id: number, data: LessonUpdateData) => {
    return LessonsService.update(id, data);
  },
  
  delete: async (id: number) => {
    return LessonsService.delete(id);
  }
};

export const useLessons = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const res = await LessonsService.getAll();
      return res.data;
    },
  });
};

export const useLesson = (id: number) => {
  return useQuery({
    queryKey: ['lessons', id],
    queryFn: () => lessonsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LessonUpdateData }) => 
      lessonsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', id] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: lessonsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
};
