'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonSchema, LessonFormData } from '@/lib/schemas/lesson';
import { useCreateLesson, useUpdateLesson } from '@/lib/react-query/hooks/use-lessons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/common/rich-editor/RichTextEditor';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LessonFormProps {
  initialData?: Partial<LessonFormData>;
  isEdit?: boolean;
  lessonId?: number;
}

export function LessonForm({ initialData, isEdit = false, lessonId }: LessonFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialData?.content || '');
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      status: initialData?.status || 'draft'
    }
  });

  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();

  useEffect(() => {
    setValue('content', content);
  }, [content, setValue]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const onSubmit = async (data: LessonFormData) => {
    try {
      const formData = { ...data, content };
      
      if (isEdit && lessonId) {
        await updateLessonMutation.mutateAsync({ id: lessonId, data: formData });
      } else {
        await createLessonMutation.mutateAsync(formData);
      }
      
      router.push('/admin/lessons');
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/lessons">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEdit ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Cập nhật thông tin bài học' : 'Tạo bài học mới cho hệ thống'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Xem trước
          </Button>
          <Button 
            onClick={() => {
              console.log('Button clicked');
              console.log('Form errors:', errors);
              console.log('Current content:', content);
              console.log('Form values:', {
                title: watch('title'),
                slug: watch('slug'),
                description: watch('description'),
                content: watch('content'),
                status: watch('status')
              });
              handleSubmit(onSubmit)();
            }}
            disabled={isSubmitting || createLessonMutation.isPending || updateLessonMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting || createLessonMutation.isPending || updateLessonMutation.isPending 
              ? 'Đang lưu...' 
              : 'Lưu bài học'
            }
          </Button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row min-h-[calc(100vh-8rem)] gap-4 xl:gap-6">
        {/* Main Content */}
        <div className="flex-1 px-2 sm:px-4 py-4 sm:py-6 min-w-0">
          <div className="space-y-6">
            {/* Content */}
            <div>
              <div className="mt-1">
                <RichTextEditor 
                  value={content}
                  onChange={setContent}
                />
              </div>
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-80 bg-muted/30 border-t xl:border-t-0 xl:border-l border-border px-2 sm:px-4 py-4 sm:py-6 shrink-0">
          <div className="space-y-6">
            {/* Lesson Details */}
            <Card className="p-4">
              <h3 className="font-bold text-foreground">Chi tiết bài học</h3>
              <div className="space-y-3">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Tiêu đề bài học *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Nhập tiêu đề bài học..."
                    className="mt-1 text-sm"
                    onChange={(e) => {
                      register('title').onChange(e);
                      const slug = generateSlug(e.target.value);
                      setValue('slug', slug);
                    }}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="slug-bai-hoc"
                    className="mt-1 font-mono text-sm"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Mô tả *</Label>
                  <Input
                    id="description"
                    {...register('description')}
                    placeholder="Mô tả ngắn gọn về bài học..."
                    className="mt-1 text-sm"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Publish Box */}
            <Card className="p-4">
              <h3 className="font-bold text-foreground">Xuất bản</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={watch('status')} 
                    onValueChange={(value) => setValue('status', value as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="archived">Đã lưu trữ</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                  )}
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
