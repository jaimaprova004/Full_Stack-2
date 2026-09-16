import "./App.css";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  addPost,
  deletePost,
  updatePost,
} from "./features/postSlice";

function App() {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const savePost = () => {
    if (!title || !content) {
      alert("Fill all fields");
      return;
    }

    if (editIndex !== null) {
      dispatch(
        updatePost({
          index: editIndex,
          post: { title, content },
        })
      );
      setEditIndex(null);
    } else {
      dispatch(addPost({ title, content }));
    }

    setTitle("");
    setContent("");
  };

  const editPost = (index) => {
    setTitle(posts[index].title);
    setContent(posts[index].content);
    setEditIndex(index);
  };

  return (
    <div className="container">
      <h1 style={{ color: "red", fontSize: "60px" }}>
  Redux Toolkit Post Manager
</h1>

      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        rows="5"
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="add-btn" onClick={savePost}>
        {editIndex !== null ? "Update Post" : "Add Post"}
      </button>

      <hr />

      {posts.map((post, index) => (
        <div className="post-card" key={index}>
          <h3>{post.title}</h3>

          <p>{post.content}</p>

          <button
            className="edit-btn"
            onClick={() => editPost(index)}
          >
            Edit
          </button>

          <button
            className="delete-btn"
            onClick={() => dispatch(deletePost(index))}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
