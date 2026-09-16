import { createSelector } from "reselect";

const selectPosts = (state) => state.posts;

export const selectAllPosts = createSelector(
  [selectPosts],
  (postsState) => postsState.posts
);

export const selectPostCount = createSelector(
  [selectPosts],
  (postsState) => postsState.posts.length
);