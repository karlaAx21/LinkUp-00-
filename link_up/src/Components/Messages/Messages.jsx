import React, { useState, useEffect, useRef } from "react";
import "./Messages.module.css";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";

const API = "https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api";

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    fetch(`${API}/Users`)
      .then(res => res.json())
      .then(data => {
        const friendsOnly = data.filter(u => u.Friend && u.id !== currentUser?.id);
        setUsers(friendsOnly);
      });
  }, []);

  useEffect(() => {
    if (selectedContact && currentUser?.id) {
      fetch(`${API}/Messages`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(
            msg =>
              (msg.senderID === currentUser.id && msg.receiverID === selectedContact.id) ||
              (msg.senderID === selectedContact.id && msg.receiverID === currentUser.id)
          );
          setMessages(filtered);
        });
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage || !selectedContact || !currentUser) return;

    const newMsg = {
      senderID: currentUser.id,
      receiverID: selectedContact.id,
      ContentM: newMessage,
      Timestamp: new Date().toISOString(),
      Read: false,
    };

    fetch(`${API}/Messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    })
      .then(res => res.json())
      .then(msg => {
        setMessages(prev => [...prev, msg]);
        setNewMessage("");
      });
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      const newMsg = {
        senderID: currentUser.id,
        receiverID: selectedContact.id,
        ContentM: base64String,
        Timestamp: new Date().toISOString(),
        Read: false,
      };

      fetch(`${API}/Messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      })
        .then(res => res.json())
        .then(msg => {
          setMessages(prev => [...prev, msg]);
        });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex vh-100 bg-light overflow-hidden rounded shadow">
      {/* Sidebar */}
      <div className="contacts border-end bg-white" style={{ width: "300px", overflowY: "auto" }}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0 fw-semibold">Messages</h5>
          <Button size="sm" variant="success" onClick={() => setShowModal(true)}>+ New</Button>
        </div>
        {users.map(user => (
          <div
            key={user.id}
            className={`d-flex align-items-center gap-3 p-3 border-bottom ${selectedContact?.id === user.id ? "bg-light border-start border-success border-4" : "hover-bg-light"}`}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedContact(user)}
          >
            <img src={user.ProfilePic} alt="Avatar" className="rounded-circle" width="45" height="45" />
            <div>
              <div className="fw-bold">{user.FirstName} {user.LastName}</div>
              <small className="text-muted">@{user.Username}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-grow-1 d-flex flex-column">
        {selectedContact ? (
          <>
            <div className="p-3 border-bottom bg-white shadow-sm">
              <h6 className="mb-0">{selectedContact.FirstName} {selectedContact.LastName}</h6>
              <small className="text-muted">@{selectedContact.Username}</small>
            </div>

            <div className="flex-grow-1 p-3 overflow-auto bg-body">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-2 px-3 my-2 rounded-4 ${msg.senderID === currentUser.id ? "bg-success text-white ms-auto" : "bg-light me-auto"}`}
                  style={{ maxWidth: "70%", width: "fit-content" }}
                >
                  {msg.ContentM.startsWith("data:image") ? (
                    <img src={msg.ContentM} alt="uploaded" style={{ maxWidth: "200px", borderRadius: "10px" }} />
                  ) : msg.ContentM.startsWith("data:video") ? (
                    <video controls style={{ maxWidth: "200px", borderRadius: "10px" }}>
                      <source src={msg.ContentM} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <span>{msg.ContentM}</span>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-top">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Form.Group controlId="file-upload" className="ms-2">
                  <Form.Label className="btn btn-outline-secondary mb-0" style={{ cursor: "pointer" }}>
                    📎
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </Form.Group>
                <Button variant="success" onClick={sendMessage} className="ms-2">
                  Send
                </Button>
              </InputGroup>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center flex-grow-1 text-muted">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Start New Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {users.map(user => (
            <div
              key={user.id}
              className="d-flex align-items-center gap-3 p-2 hover-bg-light"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedContact(user);
                setShowModal(false);
              }}
            >
              <img src={user.ProfilePic} alt="Avatar" className="rounded-circle" width="40" height="40" />
              <div>
                <div className="fw-bold">{user.FirstName} {user.LastName}</div>
                <small className="text-muted">@{user.Username}</small>
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Messages;
