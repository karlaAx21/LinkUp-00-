import React, { useState, useEffect } from "react";
import styles from "./feed.module.css";
import PostCard from "../PostCard/PostCard";
import UserCard from "../UserCard/UserCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");

  const API = "https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api";

  useEffect(() => {
    fetch(`${API}/Posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.reverse()); // most recent first
        setLoadingPosts(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
        setLoadingPosts(false);
      });

    fetch(`${API}/Users`)
      .then((res) => res.json())
      .then((data) => {
        setCreators(data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
        setLoadingUsers(false);
      });
  }, []);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Please log in to post.");
      return;
    }

    const newPost = {
      Username: currentUser.Username,
      Content: newPostContent,
      Image: newPostImage,
      Likes: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API}/Posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      const saved = await res.json();
      setPosts([saved, ...posts]);
      setNewPostContent("");
      setNewPostImage("");
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Something went wrong.");
    }
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className={`container-fluid px-4 ${styles.feedWrapper}`}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-12">

          {/* ✅ New Post Form */}
          <div className="card p-3 mb-4">
            <h5>Create a Post</h5>
            <textarea
              className="form-control mb-2"
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <input
              className="form-control mb-2"
              type="text"
              placeholder="Image URL (optional)"
              value={newPostImage}
              onChange={(e) => setNewPostImage(e.target.value)}
            />
            <button className="btn btn-success w-100" onClick={handlePostSubmit}>
              Post
            </button>
          </div>

          {/* Posts */}
          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className={styles.sidebarCard}>
            <h5 className="text-center">Top Creators</h5>
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              creators.map((user) => <UserCard key={user.id} user={user} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
