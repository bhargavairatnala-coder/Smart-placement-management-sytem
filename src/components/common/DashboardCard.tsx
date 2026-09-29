import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  onClick?: () => void;
  accentBorder?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-600',
  iconBgColor = 'bg-indigo-50',
  trend,
  onClick,
  accentBorder,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-indigo-300' : ''
      } ${accentBorder ? 'border-l-4 border-l-indigo-600' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              <span className={trend.positive ? 'text-emerald-600' : 'text-rose-600'}>
                {trend.value}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
