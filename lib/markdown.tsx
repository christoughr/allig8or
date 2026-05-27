import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mt-10 font-heading text-3xl font-bold text-white first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-8 text-xl font-semibold text-white">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-6 text-lg font-semibold text-zinc-200">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-400">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-zinc-400">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-zinc-200">{children}</strong>
        ),
        a: ({ href, children }) => {
          const external = href?.startsWith('http');
          if (external) {
            return (
              <a
                href={href}
                className="text-emerald-400 underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          }
          return (
            <Link
              href={href ?? '#'}
              className="text-emerald-400 underline-offset-2 hover:underline"
            >
              {children}
            </Link>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
