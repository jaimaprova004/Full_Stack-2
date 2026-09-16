"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostById = exports.deletePostRecord = exports.updatePostRecord = exports.createPostRecord = exports.listPosts = void 0;
const postStore = new Map();
const listPosts = () => Array.from(postStore.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
exports.listPosts = listPosts;
const createPostRecord = (payload) => {
    const id = crypto.randomUUID();
    const post = { id, ...payload, createdAt: new Date().toISOString() };
    postStore.set(id, post);
    return post;
};
exports.createPostRecord = createPostRecord;
const updatePostRecord = (id, payload) => {
    const existing = postStore.get(id);
    if (!existing)
        return null;
    const updated = { ...existing, ...payload };
    postStore.set(id, updated);
    return updated;
};
exports.updatePostRecord = updatePostRecord;
const deletePostRecord = (id) => postStore.delete(id);
exports.deletePostRecord = deletePostRecord;
const getPostById = (id) => postStore.get(id) ?? null;
exports.getPostById = getPostById;
