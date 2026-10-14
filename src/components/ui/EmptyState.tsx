import type { LucideIcon } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      {/* Icon bubble */}
      <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-5 ring-8 ring-primary-50/50">
        <Icon className="w-9 h-9 text-primary-600" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-medical-text mb-2">{title}</h3>
      <p className="text-sm text-medical-muted max-w-xs leading-relaxed">
        {description}
      </p>

      {/* Optional CTA */}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-6"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
