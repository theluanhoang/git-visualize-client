import { Card } from '@/components/ui/card';

interface TimeStatProps {
  hour: string;
  users: number;
}

export function TimeStatItem({ hour, users }: TimeStatProps) {
  const height = Math.max((users / 100) * 32, 4); // Minimum height of 4px

  return (
    <div className="text-center">
      <div className="text-xs text-gray-500 mb-1">{hour}</div>
      <div 
        className="bg-blue-100 rounded-sm flex items-end justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="bg-blue-600 w-full rounded-sm"></div>
      </div>
      <div className="text-xs text-gray-600 mt-1">{users}</div>
    </div>
  );
}

export function ActivityHeatmap({ timeStats }: { timeStats: TimeStatProps[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động theo giờ</h3>
      <div className="grid grid-cols-12 gap-2">
        {timeStats.map((stat, index) => (
          <TimeStatItem key={index} {...stat} />
        ))}
      </div>
    </Card>
  );
}
