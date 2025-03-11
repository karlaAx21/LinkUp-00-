import React from "react";
import styles from "./PostCard.module.css";

const PostCard = ({ post }) => {
  return (
    <div className={styles.postCard}>
      <h4 className={styles.username}>{post.Username}</h4>
      <p className={styles.content}>{post.Content}</p>
      {post.Image && <img src={post.Image} alt="Post" className={styles.postImage} />}
      <div className={styles.actions}>
        <button className={styles.likeBtn}>Like</button>
        <button className={styles.commentBtn}>Comment</button>
      </div>
    </div>
  );
};

export default PostCard;
