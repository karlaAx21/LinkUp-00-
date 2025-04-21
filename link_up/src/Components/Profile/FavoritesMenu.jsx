import React, { useContext } from "react";
import { UserContext } from "../../contextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const FavoritesMenu = ({ following }) => {
  const { user } = useContext(UserContext);

  return (
    <div
      className="card p-3 mt-4"
      style={{
        backgroundColor: user?.background_color || "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        height: "350px",           // 👈 Makes it scrollable
        overflowY: "auto",
      }}
    >
      <h5 className="text-center mb-3">Favorites</h5>
  
      <div style={{ maxHeight: "280px", overflowY: "auto" }}>
        <ul className="list-group">
          {following.map((fave, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: "10px 0",
              }}
            >
              <div className="d-flex align-items-center">
                <img
                  src={fave.avatar}
                  alt={fave.name}
                  className="rounded-circle me-3"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div>
                  <div className="fw-bold">{fave.name}</div>
                  <small className="text-muted">@{fave.username}</small>
                </div>
              </div>
              <button className="btn btn-sm btn-outline-danger">Unfollow</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FavoritesMenu;
