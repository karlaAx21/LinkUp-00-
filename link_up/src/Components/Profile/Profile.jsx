import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Profile.module.css";

const ProfilePage = () => {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const timestamp = Date.now();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/username/${username}`);
        const data = await res.json();
        setProfileUser(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load user:", err);
        setProfileUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) return <div className="text-center mt-5 text-muted">Loading...</div>;
  if (!profileUser) return <div className="text-center mt-5 text-danger">User not found.</div>;

  const backgroundImage = `http://localhost:5000/api/users/background/${profileUser.id}?t=${timestamp}`;
  const aboutMeHTML = profileUser.AboutMe || "<p>No info yet.</p>";

  return (
    <div
      className={styles.profileContainer}
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "60px",
      }}
    >
      <div className="container p-4">
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "10px",
            marginBottom: "1rem"
          }}
        >
          <ul className="nav nav-tabs mb-0">
            <li className="nav-item"><button className="nav-link active">Profile</button></li>
            <li className="nav-item"><button className="nav-link">Posts</button></li>
            <li className="nav-item"><button className="nav-link">Liked</button></li>
            <li className="nav-item"><button className="nav-link">Settings</button></li>
          </ul>
        </div>
      </div>

      <div className="row p-3">
        <div className="col-md-4 mb-4">
          <div className="card text-center p-4" style={{
            backgroundColor: profileUser.background_color || "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.3)"
          }}>
            <div className="d-flex justify-content-center pb-3">
              <img
                src={`http://localhost:5000/users/${profileUser.id}/profile-pic?t=${timestamp}`}
                alt="Profile"
                className="rounded-circle"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/dad.gif";
                }}
              />
            </div>

            <h4>{profileUser.FirstName} {profileUser.LastName}</h4>
            <p className="text-muted">{profileUser.email}</p>

            {profileUser.Username === JSON.parse(localStorage.getItem("currentUser"))?.Username && (
              <Link to={`/customize-profile/${profileUser.Username}`}>
                <button className="btn btn-success mt-2">Edit Profile</button>
              </Link>
            )}
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-4" style={{
            backgroundColor: profileUser.background_color || "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.3)"
          }}>
            <h5>Profile Information</h5>
            <p><strong>Username:</strong> @{profileUser.Username}</p>
            <p><strong>Email:</strong> {profileUser.email}</p>
            <p><strong>Joined:</strong> {new Date(profileUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="row mt-4 p-2">
        <div className="col">
          <div className="card p-4" style={{
            backgroundColor: profileUser.background_color || "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.3)"
          }}>
            <h5 className="mb-3">About Me</h5>
            <div dangerouslySetInnerHTML={{ __html: aboutMeHTML }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
