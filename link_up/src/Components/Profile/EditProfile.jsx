import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomizeProfile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [htmlInput, setHtmlInput] = useState("");
  const [bgUrl, setBgUrl] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [cardColor, setCardColor] = useState(user?.background_color || "#ffffff");

  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingPfp, setUploadingPfp] = useState(false);

  useEffect(() => {
    if (user) {
      setHtmlInput(user.AboutMe || "");
      setBgUrl(user.background_url || "");
      setProfilePicUrl(user.ProfilePic || "");
    }
  }, [user]);

  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const formData = new FormData();
    formData.append("background", file);
    formData.append("userId", user.id);

    try {
      setUploadingBg(true);
      const res = await fetch("http://localhost:5000/api/users/upload-background", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) setBgUrl(`http://localhost:5000${data.url}`);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingBg(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", user.id);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload-profile-pic", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setProfilePicUrl(`http://localhost:5000/users/${user.id}/profile-pic`);
      }
    } catch (err) {
      console.error(err);
    } 
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/update-profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          AboutMe: htmlInput,
          background_url: bgUrl,
          background_color: cardColor,
        }),
      });

      const updatedUser = {
        ...user,
        AboutMe: htmlInput,
        background_url: bgUrl,
        background_color: cardColor,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    }
  };

  if (!user) {
    return <div className="text-center mt-5 text-danger">Please log in first.</div>;
  }

  return (
    <div className="container mt-5 p-4">
      <div className="card p-4 mb-4">
        <h3 className="mb-3">Customize Your Profile</h3>

        <div className="form-group mb-3">
          <label>About Me (HTML allowed)</label>
          <textarea
            className="form-control"
            rows="6"
            placeholder="<h1>Welcome to my profile!</h1>"
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
          />
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Background Image</h5>
        <input
          type="file"
          className="form-control"
          accept="image/jpeg,image/png"
          onChange={handleBackgroundChange}
          disabled={uploadingBg}
        />
        {bgUrl && (
          <div className="mt-3 text-center">
            <img
              src={bgUrl}
              alt="Background Preview"
              style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "5px" }}
            />
          </div>
        )}
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Profile Picture</h5>
        <input
          type="file"
          className="form-control"
          accept="image/jpeg,image/png"
          onChange={handleProfilePicChange}
          disabled={uploadingPfp}
        />
        {profilePicUrl && (
          <div className="mt-3 text-center">
            <img
              src={profilePicUrl}
              alt="Profile Preview"
              className="rounded-circle"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          </div>
        )}
      </div>
      <div className="card p-4 mb-4">
      <h5 className="mb-3">Background Color</h5>
      <div className="d-flex justify-content-center">
      <input
        type="color"
        className="form-control form-control-color"
        value={cardColor}
        onChange={(e) => setCardColor(e.target.value)}
        title="Pick card color"
      />
    </div>
    </div>
      <button className="btn btn-success w-100 mt-3" onClick={handleSave}>
        Save & Apply
      </button>
    </div>
  );
};

export default CustomizeProfile;
