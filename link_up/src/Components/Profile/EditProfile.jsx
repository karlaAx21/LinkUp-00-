import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contextProvider";



const CustomizeProfile = () => {
  const [htmlInput, setHtmlInput] = useState(localStorage.getItem("customHTML") || "");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const handleSave = () => {
    localStorage.setItem("customHTML", htmlInput); // Store input safely
    navigate("/profile"); // Redirect to profile page
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customize Your Profile</h2>
      <textarea
        className="w-full h-40 border p-2"
        value={htmlInput}
        onChange={(e) => setHtmlInput(e.target.value)}
        placeholder="<h1>My Custom Page</h1> <style> h1 { color: red; } </style>"
      />
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleSave}
      >
        Save & Apply
      </button>
    </div>
  );
};

export default CustomizeProfile;
