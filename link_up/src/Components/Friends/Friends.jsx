import React, { useEffect, useState } from "react";
import styles from "./Friends.module.css";
import { Button, Card, Nav } from "react-bootstrap";

const API = "https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api";

const Friends = () => {
  const [tab, setTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/Users`);
      const data = await res.json();

      // Separate friends and suggestions based on `Friend` boolean
      const friendList = data.filter((user) => user.Friend === true);
      const suggestedList = data.filter((user) => user.Friend === false);

      setFriends(friendList);
      setSuggestions(suggestedList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleAdd = async (user) => {
    try {
      await fetch(`${API}/Users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Friend: true }),
      });

      setSuggestions((prev) => prev.filter((s) => s.id !== user.id));
      setFriends((prev) => [...prev, { ...user, Friend: true }]);
    } catch (err) {
      console.error("Failed to add friend:", err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`${API}/Users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Friend: false }),
      });

      setFriends((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to remove friend:", err);
    }
  };

  const renderCard = (user, footer) => (
    <Card className={styles.card} key={user.id}>
      <Card.Body className="d-flex align-items-center">
        <img src={user.ProfilePic} alt={user.Username} className={styles.avatar} />
        <div className="ms-3">
          <h6 className="mb-0">{user.FirstName} {user.LastName}</h6>
          <small className="text-muted">@{user.Username}</small>
        </div>
      </Card.Body>
      {footer && <Card.Footer className="d-flex justify-content-between">{footer}</Card.Footer>}
    </Card>
  );

  const renderContent = () => {
    if (tab === "friends") {
      return friends.length ? (
        friends.map((friend) =>
          renderCard(friend, [
            <Button
              key="remove"
              variant="outline-danger"
              size="sm"
              onClick={() => handleRemove(friend.id)}
            >
              Remove
            </Button>,
          ])
        )
      ) : (
        <p className="text-muted">You have no friends yet.</p>
      );
    }

    if (tab === "suggestions") {
      return suggestions.length ? (
        suggestions.map((user) =>
          renderCard(user, [
            <Button
              key="add"
              className="w-100 btn-success"
              size="sm"
              onClick={() => handleAdd(user)}
            >
              Add Friend
            </Button>,
          ])
        )
      ) : (
        <p className="text-muted">No suggestions available.</p>
      );
    }

    return null;
  };

  return (
    <div className="container mt-4">
      <Nav variant="tabs" activeKey={tab} onSelect={(selectedKey) => setTab(selectedKey)}>
        <Nav.Item>
          <Nav.Link eventKey="friends">Friends</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="suggestions">Suggestions</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-4 row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Friends;