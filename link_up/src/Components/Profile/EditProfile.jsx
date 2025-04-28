import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contextProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchAPI } from "../../fetchAPI";
const CustomizeProfile = () => {
  const { user } = useContext(UserContext);
  const [originalAboutMe, setOriginalAboutMe] = useState("");

  const navigate = useNavigate();
  const [customImageFile, setCustomImageFile] = useState(null);

  const [htmlInput, setHtmlInput] = useState("");
  const [bgUrl, setBgUrl] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [cardColor, setCardColor] = useState("");
  const [originalCardColor, setOriginalCardColor] = useState("");
  const [themeSongUrl, setThemeSongUrl] = useState("");
  const [themeSongTitle, setThemeSongTitle] = useState("");
  const [bioInput, setBioInput] = useState(user?.bio || "");
  const [linksInput, setLinksInput] = useState(user?.links ? JSON.parse(user.links) : [""]);


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
          setThemeSongTitle(fresh.themeSongTitle || "");
          setBioInput(fresh.bio || "");

          const minimalUserData = {
            id: fresh.id,
            Username: fresh.Username,
            AboutMe: fresh.AboutMe,
            background_color: fresh.background_color,
            bio: fresh.bio,
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
      const trimmedLinks = linksInput.filter(link => link.trim() !== "");
  
      const updatedFields = {
        AboutMe: trimmedAboutMe,
        background_color: trimmedColor,
        bio: bioInput.trim(),
        themeSongUrl: themeSongUrl.trim(),
        links: JSON.stringify(trimmedLinks),   // ✅ Add links cleanly
      };
  
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
  
      if (customImageFile) {
        const formData = new FormData();
        formData.append("customImage", customImageFile);
        formData.append("userId", user.id);
  
        await fetchAPI("http://localhost:5001/api/users/upload-custom-image", {
          method: "POST",
          body: formData,
        });
      }
  
      if (Object.keys(updatedFields).length > 0) {
        await fetchAPI(`http://localhost:5001/api/users/update-profile/${user.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedFields),
        });
      }
  
      const updatedUser = {
        ...user,
        AboutMe: trimmedAboutMe,
        background_color: trimmedColor,
        bio: bioInput.trim(),
        links: JSON.stringify(trimmedLinks),
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
          <label>Bio (max 150 characters)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your short bio..."
            maxLength={150}
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
          />
          <small className="form-text text-muted">
            {bioInput.length} / 150 characters
          </small>
        </div>

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
        <div className="form-group mb-3">
  <label>Links (one per line)</label>
  {linksInput.map((link, index) => (
    <div key={index} className="d-flex mb-2">
      <input
        type="text"
        className="form-control"
        placeholder="Enter URL"
        value={link}
        onChange={(e) => {
          const updated = [...linksInput];
          updated[index] = e.target.value;
          setLinksInput(updated);
        }}
      />
      <button
        type="button"
        className="btn btn-danger ms-2"
        onClick={() => {
          const updated = linksInput.filter((_, i) => i !== index);
          setLinksInput(updated.length ? updated : [""]);
        }}
      >
        ✖
      </button>
    </div>
  ))}
  <button
    type="button"
    className="btn btn-success"
    onClick={() => setLinksInput([...linksInput, ""])}
  >
    ➕ Add Link
  </button>
</div>

      </div>
      <div className="card p-4 mb-4">
        <h5 className="mb-3">Video/Song URL</h5>
        <input
          type="text"
          className="form-control"
          placeholder="Paste an MP3 file here"
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
        <h5 className="mb-3">Upload Custom Image</h5>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={(e) => setCustomImageFile(e.target.files[0])}
        />
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
