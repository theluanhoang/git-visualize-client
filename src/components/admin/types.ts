import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface QuickAction {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  trend?: {
    value: number;
    label?: string;
  };
  description?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}
