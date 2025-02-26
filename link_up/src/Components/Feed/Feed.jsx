import React, { useEffect, useState } from "react";

const Feed = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the logged-in user from session storage
    const storedUser = sessionStorage.getItem("loggedInUser");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if no user is found
      window.location.href = "/login";
    }
  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", padding: "50px" }}>
      {user ? (
        <>
          <h1>Welcome to the Feed, {user.username}!</h1>
          <p>This is your personalized feed.</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Feed;
