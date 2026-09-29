import React from 'react';
import { ApplicationStatus, PlacementStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | PlacementStatus | 'Upcoming' | 'In Progress' | 'Completed' | 'Scheduled' | 'Passed' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  const getStyle = (s: string) => {
    switch (s) {
      case 'Selected':
      case 'Placed':
      case 'Multiple Offers':
      case 'Passed':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';

      case 'Shortlisted':
        return 'bg-blue-50 text-blue-700 border border-blue-200';

      case 'Interview':
      case 'Scheduled':
        return 'bg-purple-50 text-purple-700 border border-purple-200';

      case 'Assessment':
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border border-amber-200';

      case 'Applied':
      case 'Upcoming':
      case 'In Process':
        return 'bg-sky-50 text-sky-700 border border-sky-200';

      case 'Rejected':
      case 'Not Placed':
        return 'bg-rose-50 text-rose-700 border border-rose-200';

      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${getStyle(
        status
      )} tracking-wide transition-colors`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Selected' || status === 'Placed' || status === 'Passed'
            ? 'bg-emerald-500'
            : status === 'Shortlisted'
            ? 'bg-blue-500'
            : status === 'Interview'
            ? 'bg-purple-500'
            : status === 'Assessment'
            ? 'bg-amber-500'
            : status === 'Rejected'
            ? 'bg-rose-500'
            : 'bg-sky-500'
        }`}
      />
      {status}
    </span>
  );
};
