'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash2,
  MoveUp,
  MoveDown,
  Code,
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

interface Section {
  id: string;
  heading: string;
  body: string;
  examples: CodeSample[];
  imageUrl?: string;
}

interface CodeSample {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
}

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
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      heading: '',
      body: '',
      examples: []
    }
  ]);

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

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      heading: '',
      body: '',
      examples: []
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length > 1) {
      setSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(section => section.id === sectionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < sections.length - 1)
    ) {
      const newSections = [...sections];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newSections[currentIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[currentIndex]];
      setSections(newSections);
    }
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, [field]: value }
        : section
    ));
  };

  const addCodeExample = (sectionId: string) => {
    const newExample: CodeSample = {
      id: Date.now().toString(),
      title: '',
      language: 'bash',
      code: '',
      description: ''
    };
    
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, examples: [...section.examples, newExample] }
        : section
    ));
  };

  const updateCodeExample = (sectionId: string, exampleId: string, field: string, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            examples: section.examples.map(example =>
              example.id === exampleId 
                ? { ...example, [field]: value }
                : example
            )
          }
        : section
    ));
  };

  const removeCodeExample = (sectionId: string, exampleId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            examples: section.examples.filter(example => example.id !== exampleId)
          }
        : section
    ));
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

      // Validate sections
      for (const section of sections) {
        if (!section.heading.trim()) {
          alert('Vui lòng nhập tiêu đề cho tất cả các phần');
          return;
        }
      }

      const lessonData = {
        ...formData,
        status,
        sections: sections.map(section => ({
          heading: section.heading,
          body: section.body,
          examples: section.examples,
          imageUrl: section.imageUrl
        }))
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/lessons">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Tạo bài học mới</h1>
            <p className="text-gray-600">Thêm bài học mới vào hệ thống</p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề bài học *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề bài học..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="slug-bai-hoc"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL sẽ là: /git-theory/{formData.slug}
                </p>
              </div>
              <div>
                <Label htmlFor="description">Mô tả ngắn</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Mô tả ngắn về bài học..."
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedTime">Thời gian ước tính</Label>
                  <Input
                    id="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                    placeholder="30 phút"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Độ khó</Label>
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

          {/* Sections */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Nội dung bài học</h2>
              <Button onClick={addSection} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm phần
              </Button>
            </div>
            
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">
                      Phần {index + 1}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={index === sections.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      {sections.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Tiêu đề phần *</Label>
                      <Input
                        value={section.heading}
                        onChange={(e) => updateSection(section.id, 'heading', e.target.value)}
                        placeholder="Tiêu đề của phần này..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>Nội dung</Label>
                      <div className="mt-1">
                        <div className="border border-gray-300 rounded-md p-4 min-h-[200px]">
                          <RichTextEditor />
                        </div>
                      </div>
                    </div>

                    {/* Code Examples */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Ví dụ code</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addCodeExample(section.id)}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Thêm ví dụ
                        </Button>
                      </div>
                      
                      {section.examples.map((example) => (
                        <div key={example.id} className="border border-gray-200 rounded-lg p-4 mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">Ví dụ code</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCodeExample(section.id, example.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <Input
                              value={example.title}
                              onChange={(e) => updateCodeExample(section.id, example.id, 'title', e.target.value)}
                              placeholder="Tiêu đề ví dụ..."
                            />
                            <Select 
                              value={example.language} 
                              onValueChange={(value) => updateCodeExample(section.id, example.id, 'language', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bash">Bash</SelectItem>
                                <SelectItem value="git">Git</SelectItem>
                                <SelectItem value="js">JavaScript</SelectItem>
                                <SelectItem value="ts">TypeScript</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="md">Markdown</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <textarea
                            value={example.code}
                            onChange={(e) => updateCodeExample(section.id, example.id, 'code', e.target.value)}
                            placeholder="Nhập code..."
                            className="w-full h-24 p-2 border border-gray-300 rounded-md font-mono text-sm"
                          />
                          
                          <Input
                            value={example.description || ''}
                            onChange={(e) => updateCodeExample(section.id, example.id, 'description', e.target.value)}
                            placeholder="Mô tả ví dụ (tùy chọn)..."
                            className="mt-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card className="p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Trạng thái & Hành động</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="status">Trạng thái</Label>
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
              
              <div className="pt-2 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => handleSubmit('published')}
                  disabled={isSubmitting}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xuất bản ngay
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSubmit('draft')}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu bản nháp
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-3">Xem trước</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tiêu đề:</span>
                <span className="font-medium">{formData.title || 'Chưa có tiêu đề'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Slug:</span>
                <span className="font-mono text-xs">{formData.slug || 'chua-co-slug'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số phần:</span>
                <span className="font-medium">{sections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian:</span>
                <span className="font-medium">{formData.estimatedTime || 'Chưa xác định'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
