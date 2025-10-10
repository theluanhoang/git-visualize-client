import api from '@/lib/api/axios';
import { LessonFormData, LessonUpdateData } from '@/lib/schemas/lesson';

const toBackendStatus = (status: string) => {
  switch (status) {
    case 'draft':
      return 'DRAFT';
    case 'published':
      return 'PUBLISHED';
    case 'archived':
      return 'REMOVED';
    default:
      return 'DRAFT';
  }
};

const fromBackendStatus = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'draft';
    case 'PUBLISHED':
      return 'published';
    case 'REMOVED':
      return 'archived';
    default:
      return 'draft';
  }
};

export const LessonsService = {
  async getAll(params?: {
    limit?: number;
    offset?: number;
    id?: number;
    slug?: string;
    status?: 'draft' | 'published' | 'archived';
    q?: string;
  }) {
    const query: any = {};
    if (params?.limit != null) query.limit = Math.min(100, Math.max(1, params.limit));
    if (params?.offset != null) query.offset = params.offset;
    if (params?.id != null) query.id = params.id;
    if (params?.slug) query.slug = params.slug;
    if (params?.status) query.status = toBackendStatus(params.status);
    if (params?.q) query.q = params.q;

    const res = await api.get('/api/v1/lesson', { params: query });
    const { data, total, limit, offset } = res.data as {
      data: Array<any>;
      total: number;
      limit: number;
      offset: number;
    };
    // map status
    const mapped = data.map((l) => ({
      ...l,
      status: fromBackendStatus(l.status),
    }));
    return { data: mapped, total, limit, offset };
  },
  async getBySlug(slug: string) {
    const res = await api.get('/api/v1/lesson', { params: { slug } });
    const { data } = res.data as { data: Array<any> };
    if (!data?.length) return null;
    const lesson = data[0];
    return { ...lesson, status: fromBackendStatus(lesson.status) } as any;
  },
  async create(data: LessonFormData) {
    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      status: toBackendStatus(data.status),
    };
    const res = await api.post('/api/v1/lesson', payload);
    return res.data;
  },
  async update(id: number, data: LessonUpdateData) {
    const payload: any = { ...data };
    if (data.status) payload.status = toBackendStatus(data.status);
    const res = await api.patch(`/api/v1/lesson/${id}`, payload);
    return res.data;
  },
  async updatePractice(id: number, practice: any) {
    const res = await api.patch(`/api/v1/lesson/${id}`, { practice });
    return res.data;
  },
  async getPracticeBySlug(slug: string) {
    const res = await api.get('/api/v1/lesson', { params: { slug } });
    const { data } = res.data as { data: Array<any> };
    if (!data?.length) return null;
    return data[0]?.practice ?? null;
  },
  async delete(id: number) {
    const res = await api.delete(`/api/v1/lesson/${id}`);
    return res.data;
  },
};

export default LessonsService;


