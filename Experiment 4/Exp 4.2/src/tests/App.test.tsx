import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  }) as any
));

describe('App', () => {
  it('renders the header and post form', async () => {
    render(<App />);

    expect(screen.getByText('Post Manager')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('0 posts shown')).toBeInTheDocument());
  });

  it('can create a post after filling the form', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '1', title: 'Test', body: 'Hello', createdAt: new Date().toISOString() }) });

    vi.stubGlobal('fetch', mockFetch as any);
    render(<App />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Body'), { target: { value: 'Hello world' } });
    fireEvent.click(screen.getByRole('button', { name: /publish post/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
  });
});
