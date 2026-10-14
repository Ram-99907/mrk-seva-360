import { useEffect, useRef } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: ConfirmVariant;
}

const VARIANT_CONFIG: Record<
  ConfirmVariant,
  {
    icon: React.ReactNode;
    iconBg: string;
    confirmClass: string;
  }
> = {
  danger: {
    icon: <AlertTriangle className="w-6 h-6 text-medical-alert" />,
    iconBg: 'bg-red-100',
    confirmClass: 'btn-danger',
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6 text-medical-warning" />,
    iconBg: 'bg-amber-100',
    confirmClass: 'btn-primary',
  },
  info: {
    icon: <Info className="w-6 h-6 text-primary-600" />,
    iconBg: 'bg-blue-100',
    confirmClass: 'btn-primary',
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  variant = 'info',
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const config = VARIANT_CONFIG[variant];

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-DEFAULT/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`flex-shrink-0 w-11 h-11 rounded-full ${config.iconBg} flex items-center justify-center`}
          >
            {config.icon}
          </div>
          <div>
            <h2
              id="confirm-modal-title"
              className="text-base font-semibold text-medical-text leading-snug"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-medical-muted leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
          <button onClick={onConfirm} className={config.confirmClass}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
