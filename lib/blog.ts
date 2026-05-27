import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords?: string[];
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8');
      const { data, content } = matter(raw);

      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ''),
        date: String(data.date ?? new Date().toISOString().slice(0, 10)),
        keywords: data.keywords as string[] | undefined,
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    keywords: data.keywords as string[] | undefined,
    content,
  };
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
