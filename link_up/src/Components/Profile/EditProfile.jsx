import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contextProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchAPI } from "../../fetchAPI";
const CustomizeProfile = () => {
  const { user } = useContext(UserContext);
  const [originalAboutMe, setOriginalAboutMe] = useState("");

  const navigate = useNavigate();

  const [htmlInput, setHtmlInput] = useState("");
  const [bgUrl, setBgUrl] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [cardColor, setCardColor] = useState("");
  const [originalCardColor, setOriginalCardColor] = useState("");
  const [themeSongUrl, setThemeSongUrl] = useState("");


  const [uploadingBg, setUploadingBg] = useState(false);

  useEffect(() => {
    if (user && user.Username) {
      fetchAPI(`http://localhost:5001/api/users/${user.id}`)
        .then(fresh => {
          setCardColor(fresh.background_color || "#ffffff");
          setOriginalCardColor(fresh.background_color || "#ffffff");
          setHtmlInput(fresh.AboutMe || "");
          setOriginalAboutMe(fresh.AboutMe || "");
          setProfilePicUrl(`http://localhost:5001/users/${fresh.id}/profile-pic`);
          setThemeSongUrl(fresh.themeSongUrl || "");

          const minimalUserData = {
            id: fresh.id,
            Username: fresh.Username,
            AboutMe: fresh.AboutMe,
            background_color: fresh.background_color,
          };
          localStorage.setItem("currentUser", JSON.stringify(minimalUserData));
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
      const res = await fetchAPI("http://localhost:5001/api/users/upload-background", {
        method: "POST",
        body: formData,
      });

      const data = await fetchAPI("http://localhost:5001/api/users/upload-background", {
        method: "POST",
        body: formData,
      });
        if (data.url) {
        const fullUrl = `http://localhost:5001${data.url}`;
        setBgUrl(fullUrl);
      
        const updatedUser = {
          ...user,
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
  
    setStagedProfilePic(file); 
    setProfilePicUrl(URL.createObjectURL(file)); 
  };
  
  const [stagedCoverPhoto, setStagedCoverPhoto] = useState(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
  
    setStagedCoverPhoto(file);
    setCoverPhotoUrl(URL.createObjectURL(file)); 
  };
  
  const handleSave = async () => {
    try {
      const trimmedAboutMe = htmlInput.trim();
      const trimmedColor = cardColor.trim();
      const updatedFields = {
        AboutMe: htmlInput,
        background_color: cardColor,
      };
  
      if (trimmedAboutMe !== originalAboutMe.trim()) {
        updatedFields.AboutMe = trimmedAboutMe;
      }
  
      if (trimmedColor !== originalCardColor.trim()) {
        updatedFields.background_color = trimmedColor;
      }
      if (themeSongUrl.trim() !== "") {
        updatedFields.themeSongUrl = themeSongUrl.trim();
      }
      
      if (stagedProfilePic) {
        const formData = new FormData();
        formData.append("profilePic", stagedProfilePic);
        formData.append("userId", user.id);
        await fetchAPI("http://localhost:5001/api/users/upload-profile-pic", {
          method: "POST",
          body: formData,
        });
      }
      
      if (stagedCoverPhoto) {
        const formData = new FormData();
        formData.append("coverPhoto", stagedCoverPhoto);
        formData.append("userId", user.id);
      
        const res = await fetchAPI("http://localhost:5001/api/users/upload-cover-photo", {
          method: "POST",
          body: formData,
        });
      
        if (!res.url) {
          throw new Error("Failed to upload cover photo.");
        }
      }
      
      
      if (Object.keys(updatedFields).length > 0) {
        await fetchAPI(`http://localhost:5001/api/users/update-profile/${user.id}`, {
          method: "PUT",
          body: JSON.stringify({
            AboutMe: htmlInput,
            background_color: cardColor,
          }),
        });
        
      }
  
      const updatedUser = {
        ...user,
        ...(trimmedAboutMe !== originalAboutMe.trim() && { AboutMe: trimmedAboutMe }),
        ...(trimmedColor !== originalCardColor.trim() && { background_color: trimmedColor }),
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
        <h5 className="mb-3">Theme Song URL</h5>
        <input
          type="text"
          className="form-control"
          placeholder="Paste a direct MP3 URL here"
          value={themeSongUrl}
          onChange={(e) => setThemeSongUrl(e.target.value)}
        />
        <small className="form-text text-muted mt-2">
          Paste a link to an MP3 file. (Example: Youtube or Soundcloud link)
        </small>
      </div>

      <div className="card p-4 mb-4">
        <h5 className="mb-3">Change Cover Photo</h5>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleCoverPhotoChange}
        />
        {coverPhotoUrl && (
          <div className="mt-3 text-center">
            <img
              src={coverPhotoUrl}
              alt="Cover Preview"
              style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "5px" }}
            />
          </div>
        )}
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
