import React, { useState } from "react";
import styles from "./PostCard.module.css";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes); // Store likes for this post
  const [isLiking, setIsLiking] = useState(false); // Prevent spam clicking

  const handleLike = async () => {
    if (isLiking) return; // Prevent multiple requests at once
    setIsLiking(true);

    try {
      const updatedLikes = likes + 1;

      // Send updated like count to MockAPI
      await fetch(`https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api/Posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: updatedLikes }),
      });

      setLikes(updatedLikes); // Update UI
    } catch (error) {
      console.error("Failed to like post:", error);
    } finally {
      setIsLiking(false); // Allow clicking again
    }
  };

  return (
    <div className={styles.postCard}>
      <h3 className={styles.username}>{post.username}</h3>
      <p className={styles.content}>{post.content}</p>
      {post.image && <img src={post.image} alt="Post" className={styles.postImage} />}

      {/* Post Actions (Like & Comment Buttons) */}
      <div className={styles.actions}>
        <button onClick={handleLike} disabled={isLiking} className={styles.likeBtn}>
          👍 {likes}
        </button>
        <button className={styles.commentBtn}>💬 Comment</button>
      </div>
    </div>
  );
};

export default PostCard;
