'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonSchema, LessonFormData, LessonWithPractices } from '@/lib/schemas/lesson';
import { useCreateLesson, useUpdateLesson } from '@/lib/react-query/hooks/use-lessons';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Save, Eye, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/common/rich-editor/RichTextEditor';
import { PracticeForm } from './PracticeForm';
import { GoalModal } from '@/components/common/practice/GoalModal';
import { PracticeFormData } from '@/lib/schemas/practice';
import { IRepositoryState } from '@/types/git';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LessonFormProps {
  initialData?: Partial<LessonWithPractices>;
  isEdit?: boolean;
  lessonId?: string;
}

export function LessonForm({ initialData, isEdit = false, lessonId }: LessonFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [content, setContent] = useState(initialData?.content || '');
  const [showPracticeForm, setShowPracticeForm] = useState(false);
  const [practices, setPractices] = useState<PracticeFormData[]>(initialData?.practices || []);
  const [editPracticeIndex, setEditPracticeIndex] = useState<number | null>(null);
  const [previewGoal, setPreviewGoal] = useState<IRepositoryState | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  
  const [serverPractices] = useState<PracticeFormData[]>(initialData?.practices || []);
  
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
    const handler = (e: CustomEvent<{ goal: IRepositoryState }>) => {
      const goal = e.detail?.goal;
      if (!goal) return;
      setPreviewGoal(goal);
      setShowGoalModal(true);
    };
    window.addEventListener('practice-goal-preview', handler as EventListener);
    return () => window.removeEventListener('practice-goal-preview', handler as EventListener);
  }, []);

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

  const handleSavePractice = (practice: PracticeFormData) => {
    if (isEdit && editPracticeIndex != null) {
      setPractices(prev => {
        const next = prev.slice();
        next[editPracticeIndex] = practice;
        return next;
      });
      setShowPracticeForm(false);
      setEditPracticeIndex(null);
      toast.success('Practice updated successfully!');
    } else {
      setPractices(prev => [...prev, practice]);
      setShowPracticeForm(false);
      setEditPracticeIndex(null);
      toast.success('Practice added to lesson (will be saved when you save the lesson)');
    }
  };

  const handleCancelPractice = () => {
    setShowPracticeForm(false);
  };

  const onSubmit = async (data: LessonFormData) => {
    try {
      const formData = { ...data, content };
      let savedLesson;
      
      if (isEdit && lessonId) {
        savedLesson = await updateLessonMutation.mutateAsync({ id: lessonId, data: formData });
      } else {
        savedLesson = await createLessonMutation.mutateAsync(formData);
      }
      
      if (practices.length > 0) {
        const lessonIdToUse = savedLesson?.id || lessonId;
        if (lessonIdToUse) {          
          const { PracticesService } = await import('@/services/practice');
          
          const savedPractices = [];
          for (const practice of practices) {
            const savedPractice = await PracticesService.create({
              ...practice,
              lessonId: lessonIdToUse
            });
            savedPractices.push(savedPractice);
          }
          
          queryClient.invalidateQueries({ queryKey: ['practices'] });
          queryClient.invalidateQueries({ queryKey: ['lessons'] });
          
          toast.success(`Lesson and ${savedPractices.length} practice(s) saved successfully!`);
          
          setPractices([]);
        }
      } else {
        toast.success('Lesson saved successfully!');
      }
      
      router.push('/admin/lessons');
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error('Failed to save lesson');
    }
  };

  return (
    <div className="space-y-6">
      {}
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
        {}
        <div className="flex-1 px-2 sm:px-4 py-4 sm:py-6 min-w-0">
          <div className="space-y-6">
            {}
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

        {}
        <div className="w-full xl:w-80 bg-muted/30 border-t xl:border-t-0 xl:border-l border-border px-2 sm:px-4 py-4 sm:py-6 shrink-0">
          <div className="space-y-6">
            {}
            <Card className="p-4">
              <h3 className="font-bold text-foreground">Chi tiết bài học</h3>
              <div className="space-y-3">
                {}
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

                {}
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

                {}
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

            {}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground">Practice Sessions</h3>
                <Button 
                  onClick={() => setShowPracticeForm(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Practice
                </Button>
              </div>
              <div className="space-y-2">
                {practices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No practices added yet
                  </p>
                ) : (
                  practices.map((practice, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{practice.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {practice.difficulty === 1 ? 'Beginner' : 
                           practice.difficulty === 2 ? 'Intermediate' : 'Advanced'} • 
                          {practice.estimatedTime} min
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditPracticeIndex(index); setShowPracticeForm(true); }}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPractices(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {}
            <Card className="p-4">
              <h3 className="font-bold text-foreground">Xuất bản</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select 
                    value={watch('status')} 
                    onValueChange={(value: 'draft' | 'published' | 'archived') => setValue('status', value)}
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

      {}
      {showPracticeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PracticeForm
              onSave={handleSavePractice}
              onCancel={handleCancelPractice}
              initialData={editPracticeIndex != null ? practices[editPracticeIndex] : undefined}
              lessonId={initialData?.id || lessonId || ''}
              practiceId={editPracticeIndex != null ? (isEdit ? serverPractices[editPracticeIndex]?.id : practices[editPracticeIndex]?.id) : undefined}
            />
          </div>
        </div>
      )}

      <GoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        goalRepositoryState={previewGoal}
        practiceTitle={initialData?.title || 'Preview Goal'}
      />
    </div>
  );
}
