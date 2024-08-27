import React, { useState, useEffect } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [formState, setFormState] = useState({
    title: "",
    body: "",
    id: null,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    setPosts(data);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formState.id) {
      // Uppdatera
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${formState.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formState.title,
            body: formState.body,
          }),
        }
      );
      const data = await response.json();
      setPosts(posts.map((post) => (post.id === data.id ? data : post)));
    } else {
      //Skapa
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formState.title,
            body: formState.body,
          }),
        }
      );
      const data = await response.json();
      setPosts([data, ...posts]);
    }

    setFormState({ title: "", body: "", id: null });
  };
  //Radera
  const handleDeletePost = async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    });
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleEditClick = (post) => {
    setFormState({
      title: post.title,
      body: post.body,
      id: post.id,
    });
  };

  return (
    <div>
      <h1>Posts</h1>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={formState.title}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Body"
            value={formState.body}
            onChange={(e) =>
              setFormState({ ...formState, body: e.target.value })
            }
            required
          />
          <button type="submit">
            {formState.id ? "Update Post" : "Add Post"}
          </button>
        </form>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => handleEditClick(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
