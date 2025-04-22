import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomizeProfile = () => {
  const { user } = useContext(UserContext);
  const [originalAboutMe, setOriginalAboutMe] = useState("");

  const navigate = useNavigate();

  const [htmlInput, setHtmlInput] = useState("");
  const [bgUrl, setBgUrl] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [cardColor, setCardColor] = useState("");
  const [originalCardColor, setOriginalCardColor] = useState("");
  

  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    if (user && user.Username) {
      fetch(`http://localhost:5000/api/users/${user.id}`)
        .then(res => res.json())
        .then(fresh => {
          setCardColor(fresh.background_color || "#ffffff");
          setOriginalCardColor(fresh.background_color || "#ffffff");
          setHtmlInput(fresh.AboutMe || "");
          setOriginalAboutMe(fresh.AboutMe || "");
          setBgUrl(fresh.background_url || "");
          setProfilePicUrl(`http://localhost:5000/users/${fresh.id}/profile-pic`);
          localStorage.setItem("currentUser", JSON.stringify(fresh));
        })
        .catch(err => {
          console.error("Failed to fetch user:", err);
        });
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
      if (data.url) {
        const fullUrl = `http://localhost:5000${data.url}`;
        setBgUrl(fullUrl);
      
        const updatedUser = {
          ...user,
          background_url: fullUrl,
        };
      
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
          } catch (err) {
      console.error(err);
    } finally {
      setUploadingBg(false);
    }
  };

  const [stagedProfilePic, setStagedProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
  
    setStagedProfilePic(file); // store it for upload later
    setProfilePicUrl(URL.createObjectURL(file)); // show local preview only
  };
  

  const handleSave = async () => {
    try {
      const trimmedAboutMe = htmlInput.trim();
      const trimmedColor = cardColor.trim();
      const updatedFields = {
        background_url: bgUrl,
      };
  
      if (trimmedAboutMe !== originalAboutMe.trim()) {
        updatedFields.AboutMe = trimmedAboutMe;
      }
  
      if (trimmedColor !== originalCardColor.trim()) {
        updatedFields.background_color = trimmedColor;
      }
  
      if (stagedProfilePic) {
        const formData = new FormData();
        formData.append("profilePic", stagedProfilePic);
        formData.append("userId", user.id);
  
        const res = await fetch("http://localhost:5000/api/users/upload-profile-pic", {
          method: "POST",
          body: formData,
        });
  
        if (!res.ok) throw new Error("Failed to upload profile picture.");
      }
  
      await fetch(`http://localhost:5000/api/users/update-profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
  
      const updatedUser = {
        ...user,
        ...(trimmedAboutMe !== originalAboutMe.trim() && { AboutMe: trimmedAboutMe }),
        ...(trimmedColor !== originalCardColor.trim() && { background_color: trimmedColor }),
        background_url: bgUrl,
      };
  
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      navigate(`/profile/${user.Username}`);
      window.location.reload();
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile.");
    }
  };
  
  
  
  
  
  
  if (!user || !user.Username) {
    return <div className="text-center mt-5 text-muted">Loading...</div>;
  }
  
  return (
    <div className="container mt-5 p-4">
      <div className="card p-4 mb-4">
        <h3 className="mb-3">Customize Your Profile</h3>

        <div className="form-group mb-3">
          <label>About Me</label>
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
        <h5 className="mb-3">Change Background Image</h5>
        <input
          type="file"
          className="form-control"
          accept="image/*"
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
        <h5 className="mb-3">Change Profile Picture</h5>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleProfilePicChange}
    
        />
<div className="mt-3 text-center">
  <img
    src={profilePicUrl || "/default.jpg"}
    alt="Profile Preview"
    className="rounded-circle"
    style={{
      outline: "3px solid #000000",
      width: "120px",
      height: "120px",
      objectFit: "cover"
    }}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "/default.jpg"; 
    }}
  />
</div>

      
      </div>
      <div className="card p-4 mb-4">
      <h5 className="mb-3">Background Color</h5>
      <div className="d-flex justify-content-center">
      <input
        type="color"
        className="form-control form-control-color"
        value={cardColor || "#ffffff"}
        onChange={(e) => setCardColor(e.target.value)}
        title="Pick card color"
      />

    </div>
    </div>
      <div className="d-flex gap-3 mt-3">
        <button className="btn btn-success w-50" onClick={handleSave}>
          Save & Apply
          
        </button>
        <button
          className="btn btn-secondary w-50"
          onClick={() => {
            window.location.href = `/profile/${user.Username}`;
          }}
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default CustomizeProfile;
