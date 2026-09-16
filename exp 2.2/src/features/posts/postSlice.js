import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "redux_3d_posts_v1";

const defaultPosts = [
  {
    id: "post-1",
    title: "State Optimization in Redux Toolkit 2.0",
    text: "Utilizing memoized Reselect selectors and slice reducers ensures optimal component re-renders and crisp UI performance.",
    category: "Tech",
    pinned: true,
    likes: 12,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    tags: ["React", "Redux", "Optimization"],
    color: "#a855f7",
  },
  {
    id: "post-2",
    title: "Next-Gen Glassmorphism & 3D WebGL",
    text: "Integrating Three.js particle systems with CSS 3D perspective transforms creates a mesmerizing interactive experience.",
    category: "Design",
    pinned: true,
    likes: 24,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    tags: ["3D", "CSS", "UI/UX"],
    color: "#06b6d4",
  },
  {
    id: "post-3",
    title: "Architecting Modern Web Applications",
    text: "Clean architecture, reactive state management, and intuitive user workflows define high-caliber production code.",
    category: "Ideas",
    pinned: false,
    likes: 8,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    tags: ["Architecture", "Engineering"],
    color: "#f59e0b",
  },
  {
    id: "post-4",
    title: "Quick Note on Component Design",
    text: "Always decouple heavy visual rendering from core business logic for clean unit testability and fast maintenance.",
    category: "Note",
    pinned: false,
    likes: 5,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ["Tips", "CleanCode"],
    color: "#10b981",
  },
];

const loadPostsFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load posts from localStorage", e);
  }
  return defaultPosts;
};

const savePostsToStorage = (posts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn("Failed to save posts to localStorage", e);
  }
};

const initialState = {
  posts: loadPostsFromStorage(),
  searchQuery: "",
  selectedCategory: "All",
  sortBy: "newest",
  viewMode: "grid", // 'grid' | 'carousel'
};

const categoryColors = {
  Tech: "#a855f7",
  Design: "#06b6d4",
  Ideas: "#f59e0b",
  Note: "#10b981",
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      const { title, text, category, tags } = action.payload;
      const newPost = {
        id: `post-${Date.now()}`,
        title: title?.trim() || "Untitled Post",
        text: text?.trim() || "",
        category: category || "Tech",
        pinned: false,
        likes: 0,
        createdAt: new Date().toISOString(),
        tags: Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
        color: categoryColors[category] || "#a855f7",
      };
      state.posts.unshift(newPost);
      savePostsToStorage(state.posts);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      savePostsToStorage(state.posts);
    },
    togglePin: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.pinned = !post.pinned;
        savePostsToStorage(state.posts);
      }
    },
    toggleLike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        savePostsToStorage(state.posts);
      }
    },
    updatePost: (state, action) => {
      const { id, title, text, category, tags } = action.payload;
      const post = state.posts.find((p) => p.id === id);
      if (post) {
        post.title = title?.trim() || post.title;
        post.text = text?.trim() || post.text;
        post.category = category || post.category;
        post.color = categoryColors[category] || post.color;
        if (tags !== undefined) {
          post.tags = Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean);
        }
        savePostsToStorage(state.posts);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    resetPostsToDefault: (state) => {
      state.posts = defaultPosts;
      savePostsToStorage(defaultPosts);
    },
  },
});

export const {
  addPost,
  deletePost,
  togglePin,
  toggleLike,
  updatePost,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setViewMode,
  resetPostsToDefault,
} = postSlice.actions;

export default postSlice.reducer;