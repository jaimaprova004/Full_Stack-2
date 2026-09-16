import { FormEvent, useEffect, useMemo, useState } from 'react';

type Post = {
  id: string;
  title: string;
  body: string;
};

type Props = {
  post: Post | null;
  onSubmit: (payload: { title: string; body: string }, id?: string) => Promise<void>;
  onComplete: () => void;
  onCancel: () => void;
};

export const PostEditor = ({ post, onSubmit, onComplete, onCancel }: Props) => {
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(post?.title ?? '');
    setBody(post?.body ?? '');
  }, [post]);

  const canSubmit = useMemo(
    () => title.trim().length >= 3 && body.trim().length >= 5,
    [title, body]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    await onSubmit({ title: title.trim(), body: body.trim() }, post?.id);
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <form className="editor" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Write a compelling title"
          required
        />
      </label>
      <label>
        Body
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Draft the full message here"
          rows={8}
          required
        />
      </label>
      <div className="actions">
        <button type="button" className="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Saving…' : post ? 'Update post' : 'Publish post'}
        </button>
      </div>
    </form>
  );
};
