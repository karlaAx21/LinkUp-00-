import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css";
import { UserContext } from "../../contextProvider";
import FavoritesMenu from "./FavoritesMenu"; 

const Profile = ({ following }) => {
  const { user } = useContext(UserContext);
  const [customHTML, setCustomHTML] = useState("");
  useEffect(() => {
    const savedHTML = localStorage.getItem("customHTML");
    if (savedHTML) {
      setCustomHTML(savedHTML);
    } else {
      setCustomHTML("<p>Hello! Nice to meet you!</p>"); // Default message
    }
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
      {user?.Username}
      </h1>
      <div className="customContentAboutMe">
        <div dangerouslySetInnerHTML={{ __html: customHTML }} />
      </div>
      <FavoritesMenu following={following} />
    </div>
  );
};

export default Profile;
