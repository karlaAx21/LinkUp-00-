import React, { useState, useEffect, useRef } from "react";
import "./Messages.module.css";
import { Button, Modal, Form } from "react-bootstrap";

const API = "https://67bea66cb2320ee05010d2b4.mockapi.io/linkup/api";

const Messages = () => {
  const [contacts, setContacts] = useState([]);
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

  return (
    <div className="messages-container d-flex">
      {/* Contact list */}
      <div className="contacts">
        <div className="d-flex justify-content-between align-items-center p-3">
          <h5>Messages</h5>
          <Button size="sm" variant="success" onClick={() => setShowModal(true)}>+ New</Button>
        </div>
        {users.map(user => (
          <div
            key={user.id}
            className={`contact ${selectedContact?.id === user.id ? "active" : ""}`}
            onClick={() => setSelectedContact(user)}
          >
            <img src={user.ProfilePic} alt="Avatar" />
            <div>
              <div className="fw-bold">{user.FirstName} {user.LastName}</div>
              <small className="text-muted">@{user.Username}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="chat-area flex-grow-1">
        {selectedContact ? (
          <>
            <div className="chat-header p-3 border-bottom">
              <h6>{selectedContact.FirstName} {selectedContact.LastName}</h6>
              <small className="text-muted">@{selectedContact.Username}</small>
            </div>

            <div className="chat-messages p-3">
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.senderID === currentUser.id ? "sent" : "received"}`}>
                  <p>{msg.ContentM}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input p-3 border-top d-flex">
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button variant="success" className="ms-2" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-muted">Select a conversation</div>
        )}
      </div>

      {/* Modal to start a new conversation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Start New Conversation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {users.map(user => (
            <div
              key={user.id}
              className="contact"
              onClick={() => {
                setSelectedContact(user);
                setShowModal(false);
              }}
            >
              <img src={user.ProfilePic} alt="Avatar" />
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
