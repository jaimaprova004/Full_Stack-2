import { useCallback, useMemo, useState } from 'react';
import { PostEditor } from './components/PostEditor';
import { PostList } from './components/PostList';
import { PostStats } from './components/PostStats';
import { SearchBar } from './components/SearchBar';
import { usePosts } from './hooks/usePosts';

const App = () => {
  const {
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
  } = usePosts();
  const [editingId, setEditingId] = useState<string | null>(null);

  const onEdit = useCallback((id: string) => setEditingId(id), []);
  const onCancel = useCallback(() => setEditingId(null), []);
  const onFinished = useCallback(() => {
    refresh();
    setEditingId(null);
  }, [refresh]);

  const editingPost = useMemo(
    () => posts.find((post) => post.id === editingId) ?? null,
    [posts, editingId]
  );

  return (
    <div className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Extraordinary UI</p>
          <h1>Post Manager</h1>
          <p className="subtitle">Fast rendering, modular backend, and interactive workflow for content teams.</p>
        </div>
      </header>

      <main className="layout">
        <section className="panel card">
          <div className="panel-header">
            <div>
              <h2>{editingPost ? 'Edit post' : 'Create a new post'}</h2>
              <p className="panel-description">Build, refine, and publish posts with instant validation and live state updates.</p>
            </div>
            <button type="button" className="refresh" onClick={refresh}>
              Refresh
            </button>
          </div>

          <PostEditor
            key={editingPost?.id ?? 'new'}
            post={editingPost}
            onSubmit={editingPost ? updatePost : createPost}
            onComplete={onFinished}
            onCancel={onCancel}
          />

          <div className="panel-subrow">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <PostStats totalPosts={stats.totalPosts} recentPostTime={stats.recentPostTime} />
          </div>

          {error ? <div className="toast error">{error}</div> : null}
        </section>

        <section className="panel card">
          <div className="panel-header">
            <h2>Latest posts</h2>
            <span>{isLoading ? 'Loading…' : `${filteredPosts.length} posts shown`}</span>
          </div>
          <PostList posts={filteredPosts} onEdit={onEdit} onDelete={deletePost} />
        </section>
      </main>
    </div>
  );
};

export default App;
