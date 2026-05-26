export async function parseApiJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();

  if (!contentType.includes('application/json')) {
    throw new Error(
      response.status === 504
        ? 'Request timed out. Try a shorter prompt or try again.'
        : `Server error (${response.status}). Please try again.`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Invalid server response. Please try again.');
  }
}
