import Link from 'next/link';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect width="36" height="36" rx="10" fill="url(#g)" />
      <path
        d="M10 24V12h4.2c2.8 0 4.6 1.5 4.6 3.9 0 1.6-.8 2.8-2.1 3.4L20 24h-3.2l-2.8-4.2H13.2V24H10zm3.2-7.2h1c1.1 0 1.7-.5 1.7-1.3s-.6-1.3-1.7-1.3h-1v2.6zM22 24l5-12h3.4l-5 12H22z"
        fill="#070b09"
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="36" y2="36">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({
  href = '/',
  showWordmark = true,
  className = '',
}: {
  href?: string;
  showWordmark?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`group flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-white">
          allig8<span className="text-emerald-400">or</span>
        </span>
      )}
    </Link>
  );
}
