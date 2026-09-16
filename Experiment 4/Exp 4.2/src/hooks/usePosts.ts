import { useCallback, useEffect, useMemo, useState } from 'react';

type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const API_BASE = '/api/posts';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to load posts');
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (payload: { title: string; body: string }) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to create post');
    const created = await response.json();
    setPosts((current) => [created, ...current]);
  }, []);

  const updatePost = useCallback(async (payload: { title: string; body: string }, id?: string) => {
    if (!id) return;
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to update post');
    const updated = await response.json();
    setPosts((current) => current.map((post) => (post.id === updated.id ? updated : post)));
  }, []);

  const deletePost = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete post');
    setPosts((current) => current.filter((post) => post.id !== id));
  }, []);

  const refresh = useCallback(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const stats = useMemo(
    () => ({
      totalPosts: posts.length,
      recentPostTime: posts[0]?.createdAt ?? null
    }),
    [posts]
  );

  const memoized = useMemo(
    () => ({
      posts,
      filteredPosts,
      isLoading,
      error,
      createPost,
      updatePost,
      deletePost,
      refresh,
      searchQuery,
      setSearchQuery,
      stats
    }),
    [posts, filteredPosts, isLoading, error, createPost, updatePost, deletePost, refresh, searchQuery, setSearchQuery, stats]
  );

  return memoized;
};
