import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css"
const ProfilePage = () => {
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <div className="text-center mt-5 text-danger">User not logged in.</div>;
  }

  const backgroundImage = `http://localhost:5000/api/users/background/${currentUser.id}`;
  const aboutMeHTML = currentUser.AboutMe || "<p>No info yet.</p>";

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

    
          <div
            className="container p-4"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.3)"
            }}
          >
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item"><button className="nav-link active">Profile</button></li>
          <li className="nav-item"><button className="nav-link">Posts</button></li>
          <li className="nav-item"><button className="nav-link">Liked</button></li>
          <li className="nav-item"><button className="nav-link">Settings</button></li>
        </ul>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card text-center p-4" style={{
              backgroundColor: currentUser.background_color || "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.3)"
            }}>
                        
            <div className="d-flex justify-content-center">
              <img
                src={`http://localhost:5000/users/${currentUser.id}/profile-pic`}
                alt="Profile"
                className="rounded-circle"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                }}
              />
            </div>

              <h4>{currentUser.FirstName} {currentUser.LastName}</h4>
              <p className="text-muted">{currentUser.email}</p>
              <Link to="/customize-profile">
                <button className="btn btn-success mt-2">Edit Profile</button>
              </Link>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card p-4" style={{
              backgroundColor: currentUser.background_color || "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.3)"
            }}>
              <h5>Profile Information</h5>
              <p><strong>Username:</strong> @{currentUser.Username}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Joined:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <div className="card p-4" style={{
              backgroundColor: currentUser.background_color || "rgba(255, 255, 255, 0.1)",
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
    </div>
  );
};

export default ProfilePage;
