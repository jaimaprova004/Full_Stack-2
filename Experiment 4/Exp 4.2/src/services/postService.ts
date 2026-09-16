export type PostPayload = {
  title: string;
  body: string;
};

export type PostRecord = PostPayload & {
  id: string;
  createdAt: string;
};

const postStore = new Map<string, PostRecord>();

export const listPosts = () =>
  Array.from(postStore.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const createPostRecord = (payload: PostPayload) => {
  const id = crypto.randomUUID();
  const post: PostRecord = { id, ...payload, createdAt: new Date().toISOString() };
  postStore.set(id, post);
  return post;
};

export const updatePostRecord = (id: string, payload: PostPayload) => {
  const existing = postStore.get(id);
  if (!existing) return null;
  const updated: PostRecord = { ...existing, ...payload };
  postStore.set(id, updated);
  return updated;
};

export const deletePostRecord = (id: string) => postStore.delete(id);

export const getPostById = (id: string) => postStore.get(id) ?? null;
