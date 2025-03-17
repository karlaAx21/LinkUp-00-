import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css";
import { UserContext } from "../../contextProvider";

const Profile = ({ following }) => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.followingContainer}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Favorites
      </h2>

 
      {user?.Username ? (
  <Link to={`/customize-profile/${user.Username}`} className="">
    Edit Profile
  </Link>
) : (
  <p>Loading...</p> 
)}


      <ul className={styles.listContainer}>
        {following.map((user, index) => (
          <li key={index} className={styles.listItem}>
            <div className={styles.userInfo}>
              <span className="text-gray-900 font-medium">{user.name}</span>
              <p className="text-gray-500 text-sm">@{user.username}</p>
            </div>
            <button className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              Unfollow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};



const exampleFavorites = [
  { name: "Baylee37", username: "baylee37", avatar: "https://via.placeholder.com/40" },
  { name: "Icie Jast", username: "icie_jast", avatar: "https://via.placeholder.com/40" },
  { name: "Michel64", username: "michel64", avatar: "https://via.placeholder.com/40" },
  { name: "Avery23", username: "avery23", avatar: "https://via.placeholder.com/40" },
  { name: "Jordan98", username: "jordan98", avatar: "https://via.placeholder.com/40" },
  { name: "Taylor_W", username: "taylor_w", avatar: "https://via.placeholder.com/40" },
  { name: "CharlieX", username: "charlie_x", avatar: "https://via.placeholder.com/40" },
  { name: "MorganK", username: "morgan_k", avatar: "https://via.placeholder.com/40" },
  { name: "Skyler99", username: "skyler99", avatar: "https://via.placeholder.com/40" },
  { name: "RileyC", username: "riley_c", avatar: "https://via.placeholder.com/40" },
  { name: "DakotaF", username: "dakota_f", avatar: "https://via.placeholder.com/40" },
  { name: "PeytonJ", username: "peyton_j", avatar: "https://via.placeholder.com/40" },
  { name: "Alex_T", username: "alex_t", avatar: "https://via.placeholder.com/40" },
  { name: "Quinn22", username: "quinn22", avatar: "https://via.placeholder.com/40" },
  { name: "JamieLee", username: "jamie_lee", avatar: "https://via.placeholder.com/40" },
  { name: "BlakeH", username: "blake_h", avatar: "https://via.placeholder.com/40" },
  { name: "DrewM", username: "drew_m", avatar: "https://via.placeholder.com/40" },
  { name: "CaseyL", username: "casey_l", avatar: "https://via.placeholder.com/40" },
  { name: "Jordan_S", username: "jordan_s", avatar: "https://via.placeholder.com/40" },
  { name: "ReeseA", username: "reese_a", avatar: "https://via.placeholder.com/40" },
];



export default function App() {
  return <Profile following={exampleFavorites} />;
}
