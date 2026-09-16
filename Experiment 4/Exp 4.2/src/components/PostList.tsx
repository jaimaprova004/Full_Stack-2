import { memo, useCallback } from 'react';

type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

type Props = {
  posts: Post[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

const PostItem = memo(({ post, onEdit, onDelete }: { post: Post; onEdit: (id: string) => void; onDelete: (id: string) => void }) => {
  const handleDelete = useCallback(() => onDelete(post.id), [onDelete, post.id]);
  const handleEdit = useCallback(() => onEdit(post.id), [onEdit, post.id]);

  return (
    <li className="post-item">
      <div>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <span>{formatDate(post.createdAt)}</span>
      </div>
      <div className="item-actions">
        <button type="button" onClick={handleEdit}>
          Edit
        </button>
        <button type="button" className="danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
});

export const PostList = ({ posts, onEdit, onDelete }: Props) => {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};
