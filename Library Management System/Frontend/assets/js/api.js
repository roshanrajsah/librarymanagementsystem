const api = {
  async request(url, options = {}) {
    const response = await fetch(`/api${url}`, options);
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) throw new Error(data?.error || 'Something went wrong.');
    return data;
  },
  get(url) { return this.request(url); },
  post(url, body) { return this.request(url, { method: 'POST', body, headers: typeof body === 'string' ? { 'Content-Type': 'application/json' } : {} }); },
  put(url, body) { return this.request(url, { method: 'PUT', body, headers: typeof body === 'string' ? { 'Content-Type': 'application/json' } : {} }); },
  delete(url) { return this.request(url, { method: 'DELETE' }); }
};
