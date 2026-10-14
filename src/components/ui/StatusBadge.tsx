import type { AppointmentStatus } from '../../types';

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'badge badge-gray',
  },
  pending: {
    label: 'Pending',
    className: 'badge badge-yellow',
  },
  accepted: {
    label: 'Accepted',
    className: 'badge badge-green',
  },
  rejected: {
    label: 'Rejected',
    className: 'badge badge-red',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'badge badge-gray',
  },
  completed: {
    label: 'Completed',
    className: 'badge badge-blue',
  },
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'badge badge-gray',
  };

  return (
    <span className={`${config.className} ${className}`}>
      {config.label}
    </span>
  );
}
