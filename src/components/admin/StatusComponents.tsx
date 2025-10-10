import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'published' | 'draft' | 'archived';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    published: { label: 'Đã xuất bản', variant: 'default' as const },
    draft: { label: 'Bản nháp', variant: 'secondary' as const },
    archived: { label: 'Đã lưu trữ', variant: 'outline' as const },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}

interface DateDisplayProps {
  date: string;
  showIcon?: boolean;
}

export function DateDisplay({ date, showIcon = false }: DateDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {showIcon && <Calendar className="h-4 w-4" />}
      <span>{formatDate(date)}</span>
    </div>
  );
}

interface TimeDisplayProps {
  time: string;
  showIcon?: boolean;
}

export function TimeDisplay({ time, showIcon = false }: TimeDisplayProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {showIcon && <Clock className="h-4 w-4" />}
      <span>{time}</span>
    </div>
  );
}
