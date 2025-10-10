import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { TopLessonItemProps } from './analytics-types';

export function TopLessonItem({ id, title, views, completionRate, rating, index }: TopLessonItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{views} lượt xem</span>
            <span>{completionRate}% hoàn thành</span>
            <span>⭐ {rating}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
      </div>
    </div>
  );
}

export function TopLessonsCard({ lessons }: { lessons: Omit<TopLessonItemProps, 'index'>[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bài học phổ biến</h3>
        <Button variant="outline" size="sm">Xem tất cả</Button>
      </div>
      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <TopLessonItem key={lesson.id} {...lesson} index={index} />
        ))}
      </div>
    </Card>
  );
}
