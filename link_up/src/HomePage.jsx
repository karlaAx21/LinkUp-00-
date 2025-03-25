import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";
import { FaComments, FaUserFriends, FaCompass } from "react-icons/fa";


const HomePage = () => {
  const navigate = useNavigate();
  const socialImg = "/images/social.jpg";

  return (
    <div className={`container-fluid ${styles.homepage}`}>
      {/* HERO SECTION */}
      <div className="row align-items-center py-5 min-vh-100">
        <div className="col-md-6 text-start">
          <h1 className="display-4 fw-bold">Connect with friends on <span className={styles.brand}>LinkUp</span></h1>
          <p className="text-muted fs-5 mb-4">
            Share moments, chat in real-time, and discover new connections with our modern social platform.
          </p>
          <button className={`btn ${styles.mintButton} me-3 px-4 py-2`} onClick={() => navigate("/signup")}>
            Get Started →
          </button>
          <button className="btn btn-outline-dark px-4 py-2" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <div className={styles.placeholderImage}><img src={socialImg} alt="Social" />
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="py-5 bg-light rounded">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">Features</h2>
          <p className="text-muted">Everything you need to connect with friends and share your life.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="bg-white rounded shadow-sm p-4 text-center h-100">
              <FaComments size={40} className={styles.mintIcon} />
              <h5 className="fw-bold mt-3">Real-time Chat</h5>
              <p className="text-muted">Chat with your friends in real-time with our fast messaging system.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white rounded shadow-sm p-4 text-center h-100">
              <FaUserFriends size={40} className={styles.mintIcon} />
              <h5 className="fw-bold mt-3">Friend Connections</h5>
              <p className="text-muted">Send and receive friend requests to build your network.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white rounded shadow-sm p-4 text-center h-100">
              <FaCompass size={40} className={styles.mintIcon} />
              <h5 className="fw-bold mt-3">Explore</h5>
              <p className="text-muted">Discover trending topics and connect with new people.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
