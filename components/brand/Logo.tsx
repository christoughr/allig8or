import Link from 'next/link';

/** Emerald tile + crocodile mascot (page UI only — favicon stays separate) */
export function LogoMark({
  className = 'h-9 w-9',
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const text =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20 select-none ${text} ${className}`}
      aria-hidden
    >
      🐊
    </span>
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
          allig8<span className="text-emerald-400">tor</span>
        </span>
      )}
    </Link>
  );
}
