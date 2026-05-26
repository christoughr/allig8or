/** Remove markdown code fences from Claude HTML responses */
export function stripHtmlFences(raw: string): string {
  let html = raw.trim();
  const fenceMatch = html.match(/^```(?:html)?\s*\n?([\s\S]*?)\n?```$/i);
  if (fenceMatch) html = fenceMatch[1].trim();
  return html.replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim();
}
