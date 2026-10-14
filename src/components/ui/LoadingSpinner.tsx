interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const SIZE_MAP = {
  sm: { svg: 20, stroke: 2 },
  md: { svg: 36, stroke: 3 },
  lg: { svg: 56, stroke: 4 },
};

export default function LoadingSpinner({
  message,
  size = 'md',
  fullPage = false,
}: LoadingSpinnerProps) {
  const { svg, stroke } = SIZE_MAP[size];

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        width={svg}
        height={svg}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="#1769AA"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
      {message && (
        <p className="text-sm text-medical-muted animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-bg">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-12">
      {spinner}
    </div>
  );
}
