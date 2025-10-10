'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash2,
  Image,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/common/rich-editor/RichTextEditor';
import Link from 'next/link';


export default function NewLessonPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'draft',
    prerequisites: [] as string[],
    estimatedTime: '',
    difficulty: 'beginner'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };




  const handleSubmit = async (status: 'draft' | 'published') => {
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.title.trim()) {
        alert('Vui lòng nhập tiêu đề bài học');
        return;
      }
      
      if (!formData.slug.trim()) {
        alert('Vui lòng nhập slug bài học');
        return;
      }


      const lessonData = {
        ...formData,
        status
      };

      // TODO: Gửi dữ liệu lên API
      console.log('Lesson data:', lessonData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Bài học đã được ${status === 'draft' ? 'lưu bản nháp' : 'xuất bản'} thành công!`);
      router.push('/admin/lessons');
      
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Có lỗi xảy ra khi lưu bài học');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* WordPress-style Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/lessons">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tạo bài học mới</h1>
              <p className="text-sm text-muted-foreground">Thêm bài học mới vào hệ thống</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu bản nháp
            </Button>
            <Button 
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
            >
              <Eye className="h-4 w-4 mr-2" />
              Xuất bản
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-8rem)] gap-4 lg:gap-6">
        {/* Main Content - WordPress Style Editor */}
        <div className="flex-1 px-2 sm:px-4 py-4 sm:py-6 min-w-0">
          {/* WordPress-style Title Input */}
          <div className="mb-6">
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Nhập tiêu đề bài học..."
              className="text-2xl font-bold border-0 border-b-2 border-border rounded-none px-0 py-3 focus:border-primary focus:ring-0 bg-transparent"
            />
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <span>Slug: /git-theory/{formData.slug || 'slug-bai-hoc'}</span>
              <span className="hidden sm:inline">•</span>
              <span>Thời gian: {formData.estimatedTime || 'Chưa xác định'}</span>
              <span className="hidden sm:inline">•</span>
              <span>Độ khó: {formData.difficulty === 'beginner' ? 'Cơ bản' : formData.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}</span>
            </div>
          </div>

          {/* WordPress-style Editor */}
          <Card className="border-0 shadow-none bg-transparent">
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Editor Toolbar */}
              <div className="bg-muted/50 border-b border-border px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Nội dung bài học</span>
                  </div>
                </div>
              </div>
              
              {/* Editor Content */}
              <div className="p-4 sm:p-6">
                <div className="border border-border rounded-lg overflow-hidden">
                  <RichTextEditor />
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* WordPress-style Sidebar */}
        <div className="w-full lg:w-80 bg-muted/30 border-t lg:border-t-0 lg:border-l border-border px-2 sm:px-4 py-4 sm:py-6 shrink-0">
          <div className="space-y-6">
            {/* Publish Box */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Xuất bản</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="status" className="text-xs text-muted-foreground">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSubmit('draft')}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Lưu nháp
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleSubmit('published')}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xuất bản
                  </Button>
                </div>
              </div>
            </Card>

            {/* Lesson Settings */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Cài đặt bài học</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="slug" className="text-xs text-muted-foreground">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="slug-bai-hoc"
                    className="mt-1 text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    /git-theory/{formData.slug || 'slug-bai-hoc'}
                  </p>
                </div>
                <div>
                  <Label htmlFor="description" className="text-xs text-muted-foreground">Mô tả</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả ngắn..."
                    className="mt-1 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="estimatedTime" className="text-xs text-muted-foreground">Thời gian</Label>
                    <Input
                      id="estimatedTime"
                      value={formData.estimatedTime}
                      onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                      placeholder="30 phút"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty" className="text-xs text-muted-foreground">Độ khó</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Cơ bản</SelectItem>
                        <SelectItem value="intermediate">Trung bình</SelectItem>
                        <SelectItem value="advanced">Nâng cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Prerequisites */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Điều kiện tiên quyết</h3>
              <div className="space-y-2">
                {formData.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={prereq}
                      onChange={(e) => {
                        const newPrereqs = [...formData.prerequisites];
                        newPrereqs[index] = e.target.value;
                        setFormData(prev => ({ ...prev, prerequisites: newPrereqs }));
                      }}
                      placeholder="Điều kiện tiên quyết..."
                      className="text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPrereqs = formData.prerequisites.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, prerequisites: newPrereqs }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      prerequisites: [...prev.prerequisites, '']
                    }));
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm điều kiện
                </Button>
              </div>
            </Card>

            {/* Lesson Stats */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Thống kê</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tiêu đề:</span>
                  <span className="text-foreground">{formData.title.length} ký tự</span>
                </div>
                <div className="flex justify-between">
                  <span>Mô tả:</span>
                  <span className="text-foreground">{formData.description.length} ký tự</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng ký tự:</span>
                  <span className="text-foreground">
                    {formData.title.length + formData.description.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className="text-foreground">
                    {formData.status === 'draft' ? 'Bản nháp' : 'Đã xuất bản'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Thao tác nhanh</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Xuất PDF
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Image className="h-4 w-4 mr-2" />
                  Thêm hình ảnh
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
