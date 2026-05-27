/** Office Online viewer for https URLs; blob tab for local data URLs. */
export function officeViewerUrl(fileUrl: string): string | null {
  if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
    return null;
  }
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
}

export function openGeneratedFile(fileUrl: string, fileName?: string): void {
  const office = officeViewerUrl(fileUrl);
  if (office) {
    window.open(office, '_blank', 'noopener,noreferrer');
    return;
  }

  if (fileUrl.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    if (fileName) a.download = fileName;
    a.click();
    return;
  }

  window.open(fileUrl, '_blank', 'noopener,noreferrer');
}
