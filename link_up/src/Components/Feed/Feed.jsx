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

  useEffect(() => {
    fetch("https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Posts")
      .then((res) => res.json())
      .then((data) => {
      console.log("Fetched posts:", data);
      setPosts(data);
      setLoadingPosts(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
        setLoadingPosts(false);
      });


    fetch("https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Users")
      .then((res) => res.json())
      .then((data) => {
        setCreators(data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        setError("Failed to load users");
        setLoadingUsers(false);
      });
  }, []);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.feedContainer}>
      {/* Main Feed Section */}
      <div className={styles.feed}>
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
      
      {/* Suggested Users Section */}
      <div className={styles.creators}>
        <h3>Top Creators</h3>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          creators.map((user) => <UserCard key={user.id} user={user} />)
        )}
      </div>
    </div>
  );
};

export default Feed;