import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfilePage = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return (
      <div className="text-center mt-5 text-danger">
        User not logged in. Please sign in first.
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className="nav-link active">Profile</button>
        </li>
        <li className="nav-item">
          <button className="nav-link">Posts</button>
        </li>
        <li className="nav-item">
          <button className="nav-link">Liked</button>
        </li>
        <li className="nav-item">
          <button className="nav-link">Settings</button>
        </li>
      </ul>

      <div className="row">
        {/* Left Card */}
        <div className="col-md-4 mb-4">
          <div className="card text-center p-4">
            <img
              src={currentUser.ProfilePic}
              alt="Profile"
              className="rounded-circle img-thumbnail mb-3"
              width="100"
              height="100"
            />
            <h4>{currentUser.FirstName} {currentUser.LastName}</h4>
            <p className="text-muted">{currentUser.email}</p>
            <div className="d-flex justify-content-around my-3">
              <div>
                <strong>0</strong>
                <p className="mb-0 text-muted">Posts</p>
              </div>
              <div>
                <strong>{currentUser.Friend ? "1" : "0"}</strong>
                <p className="mb-0 text-muted">Friends</p>
              </div>
            </div>
            <button className="btn btn-success mt-2">Edit Profile</button>
          </div>
        </div>

        {/* Right Info */}
        <div className="col-md-8">
          <div className="card p-4">
            <h5 className="mb-3">Profile Information</h5>
            <p className="text-muted">View your profile information.</p>
            <div>
              <strong>Full Name</strong>
              <p>{currentUser.FirstName} {currentUser.LastName}</p>
            </div>
            <div>
              <strong>Username</strong>
              <p>@{currentUser.Username}</p>
            </div>
            <div>
              <strong>Email</strong>
              <p>{currentUser.email}</p>
            </div>
            <div>
              <strong>Joined</strong>
              <p>{new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;