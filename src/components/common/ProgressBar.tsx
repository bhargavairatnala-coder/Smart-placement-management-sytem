import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showValue?: boolean;
  color?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple';
  height?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  showValue = true,
  color = 'indigo',
  height = 'md',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[height];

  const colorGradient = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-400 to-amber-500',
    blue: 'from-blue-500 to-indigo-500',
    purple: 'from-purple-500 to-indigo-500',
  }[color];

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          {label && <span>{label}</span>}
          {showValue && <span className="font-semibold text-slate-800">{clamped}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorGradient} transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
