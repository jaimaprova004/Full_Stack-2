import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    deletePost: (state, action) => {
      state.posts.splice(action.payload, 1);
    },

    updatePost: (state, action) => {
      state.posts[action.payload.index] = action.payload.post;
    },
  },
});

export const { addPost, deletePost, updatePost } = postSlice.actions;

export default postSlice.reducer;