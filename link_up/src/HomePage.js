import React from "react";
import "./style.css"; // Ensure you include a CSS file for custom styles

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-neon-green">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-black shadow-lg">
        <h1 className="text-4xl font-bold text-neon-green">LinkUp</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-neon-green text-black font-semibold rounded-lg shadow-md hover:bg-green-500 transition">
            Log In
          </button>
          <button className="px-4 py-2 border-2 border-neon-green text-neon-green font-semibold rounded-lg shadow-md hover:bg-neon-green hover:text-black transition">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Centered Content */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-6xl font-extrabold text-neon-green glow">LinkUp</h1>
      </div>
    </div>
  );
};

export default HomePage;