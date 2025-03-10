import React, { useEffect, useState } from "react";
import Modal from "react-modal";

// Initialize the react-modal
Modal.setAppElement('#root'); // Change this if your root element has a different id

const FeedAndCreatePost = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = "/login";
    }

    // Fetch posts from session storage
    const storedPosts = sessionStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPost = {
      username: user.username,
      title,
      content,
      createdAt: new Date().toLocaleString(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    sessionStorage.setItem("posts", JSON.stringify(updatedPosts)); // Save posts to session storage

    setTitle("");
    setContent("");
    setModalIsOpen(false); // Close the modal
  };

  return (
    <div style={{ color: "white", textAlign: "center", padding: "50px" }}>
      {user ? (
        <>
          <h1>Welcome to the Feed, {user.username}!</h1>
          <p>This is your personalized feed.</p>

          <button onClick={() => setModalIsOpen(true)}>Create Post</button>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Create Post"
          >
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="content">Content:</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <button type="submit">Post</button>
              <button onClick={() => setModalIsOpen(false)}>Cancel</button>
            </form>
          </Modal>

          <div>
            <h1>Posts</h1>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <p>
                    <strong>By: {post.username}</strong> on {post.createdAt}
                  </p>
                </div>
              ))
            ) : (
              <p>No posts yet. Be the first to create one!</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FeedAndCreatePost;
