'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUp, Loader2, Sparkles, Trash2, UploadCloud } from 'lucide-react';

interface GenerateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: {
    sourceType: 'url' | 'file';
    url?: string;
    file?: File;
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
  const [sourceType, setSourceType] = useState<'url' | 'file'>('url');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (files?: FileList | null) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    // Basic validation: up to ~20MB, common types
    const maxBytes = 20 * 1024 * 1024;
    if (selected.size > maxBytes) {
      setError('Kích thước tệp vượt quá 20MB.');
      return;
    }
    setError(null);
    setFile(selected);
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer?.files);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceType === 'url') {
      if (!url.trim()) {
        setError('Vui lòng nhập URL hợp lệ.');
        return;
      }
    }
    if (sourceType === 'file') {
      if (!file) {
        setError('Vui lòng tải lên một tệp.');
        return;
      }
    }

    const params = {
      sourceType,
      url: sourceType === 'url' ? url.trim() : undefined,
      file: sourceType === 'file' ? file ?? undefined : undefined,
      language: language || 'vi',
      model: model || 'gemini-2.5-flash',
      outlineStyle: outlineStyle || 'detailed',
      additionalInstructions: additionalInstructions.trim() || undefined,
    } as const;

    console.log('🔍 Sending generate request with params:', params);
    
    await onGenerate(params);

    setUrl('');
    setAdditionalInstructions('');
    setFile(null);
    setError(null);
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
            <Label htmlFor="source">Nguồn dữ liệu</Label>
            <Select value={sourceType} onValueChange={(value) => setSourceType(value as 'url' | 'file')} disabled={isGenerating}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">Liên kết (URL)</SelectItem>
                <SelectItem value="file">Tệp tải lên</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            {sourceType === 'url' ? (
              <div>
                <Label htmlFor="url">URL hoặc liên kết nội dung *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://git-scm.com/docs/git-branch"
                  className="mt-1"
                  disabled={isGenerating}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Nhập URL của trang web chứa nội dung bạn muốn tạo bài học
                </p>
              </div>
            ) : (
              <div>
                <Label>Tệp nội dung *</Label>
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`mt-1 flex flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors ${dragActive ? 'border-purple-500 bg-purple-50/50' : 'border-muted-foreground/25 bg-muted/30'} ${isGenerating ? 'opacity-60' : ''}`}
                >
                  {file ? (
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileUp className="h-5 w-5 text-purple-600" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)} disabled={isGenerating}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm">Kéo và thả tệp vào đây</p>
                      <p className="text-xs text-muted-foreground">hoặc</p>
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => inputRef.current?.click()}
                          disabled={isGenerating}
                        >
                          Chọn tệp từ máy
                        </Button>
                        <input
                          ref={inputRef}
                          type="file"
                          accept=".pdf,.md,.txt,.doc,.docx,.html,.htm"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e.target.files)}
                          disabled={isGenerating}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Hỗ trợ: PDF, DOCX, HTML, TXT, MD (tối đa 20MB)</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

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
              disabled={(sourceType === 'url' ? !url.trim() : !file) || isGenerating}
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
