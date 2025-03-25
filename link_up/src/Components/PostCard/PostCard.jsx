import React, { useState } from "react";
import styles from "./PostCard.module.css";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.Likes || 0);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const API = "https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api";

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const updatedLikes = liked ? likes - 1 : likes + 1;

    try {
      await fetch(`${API}/Posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Likes: updatedLikes }),
      });
      setLikes(updatedLikes);
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const toggleComments = async () => {
    if (!showComments) {
      try {
        const res = await fetch(`${API}/Comments?Postid=${post.id}`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const commentData = {
      Text: newComment,
      Username: currentUser?.Username || "Guest",
      Postid: post.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API}/Comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });

      const saved = await response.json();
      setComments([...comments, saved]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className={`card mb-4 shadow-sm ${styles.postCard}`}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className={`rounded-circle ${styles.avatar}`}>
            {post.Username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="ms-3">
            <h6 className="mb-0">{post.Username || "Unknown"}</h6>
            <small className="text-muted">Posted just now</small>
          </div>
        </div>

        <p className="mb-3">{post.Content}</p>
        {post.Image && (
          <img src={post.Image} alt="Post" className="img-fluid rounded mb-3" />
        )}

        <div className="d-flex justify-content-between mb-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`btn btn-sm ${liked ? styles.liked : styles.likeBtn}`}
          >
            ❤️ {likes}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={toggleComments}
          >
            💬 Comment
          </button>
        </div>

        {showComments && (
          <div className="comment-section mt-3">
            <div className="mb-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
                    <strong>{comment.Username || "Anonymous"}</strong>:{" "}
                    {comment.Text}
                    <div className="text-muted small">
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No comments yet.</p>
              )}
            </div>

            <div className="d-flex">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="form-control me-2"
                placeholder="Write a comment..."
              />
              <button
                className="btn btn-success"
                onClick={handleCommentSubmit}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;