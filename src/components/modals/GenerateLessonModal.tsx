'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Sparkles } from 'lucide-react';

interface GenerateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: {
    sourceType: 'url' | 'file';
    url?: string;
    language?: 'vi' | 'en';
    model?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
    outlineStyle?: 'concise' | 'detailed';
    additionalInstructions?: string;
  }) => Promise<void>;
  isGenerating: boolean;
}

export function GenerateLessonModal({ isOpen, onClose, onGenerate, isGenerating }: GenerateLessonModalProps) {
  const [url, setUrl] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [model, setModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [outlineStyle, setOutlineStyle] = useState<'concise' | 'detailed'>('detailed');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }

    const params = {
      sourceType: 'url' as const,
      url: url.trim(),
      language: language || 'vi',
      model: model || 'gemini-2.5-flash',
      outlineStyle: outlineStyle || 'detailed',
      additionalInstructions: additionalInstructions.trim() || undefined,
    };

    console.log('🔍 Sending generate request with params:', params);
    
    await onGenerate(params);

    setUrl('');
    setAdditionalInstructions('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Tạo bài học bằng AI
          </DialogTitle>
          <DialogDescription>
            Nhập URL hoặc thông tin để AI tự động tạo nội dung bài học cho bạn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL hoặc liên kết nội dung *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://git-scm.com/docs/git-branch"
              className="mt-1"
              required
              disabled={isGenerating}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Nhập URL của trang web chứa nội dung bạn muốn tạo bài học
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Ngôn ngữ</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as 'vi' | 'en')} disabled={isGenerating}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model">AI Model</Label>
              <Select value={model} onValueChange={(value) => setModel(value as any)} disabled={isGenerating}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-flash">Gemini Flash (Nhanh)</SelectItem>
                  <SelectItem value="gemini-2.5-pro">Gemini Pro (Chất lượng cao)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="outlineStyle">Phong cách</Label>
            <Select value={outlineStyle} onValueChange={(value) => setOutlineStyle(value as any)} disabled={isGenerating}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Ngắn gọn</SelectItem>
                <SelectItem value="detailed">Chi tiết</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="instructions">Hướng dẫn bổ sung (tùy chọn)</Label>
            <Textarea
              id="instructions"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Ví dụ: Tạo 2 practice sessions, tập trung vào practical examples..."
              className="mt-1"
              rows={3}
              disabled={isGenerating}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!url.trim() || isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Tạo bài học
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
