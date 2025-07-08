import React from "react";
import { Sidebar } from "./index.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function Home() {
  const { user, isAuthenticated } = useAuth();
  return (
    <div>
      <Sidebar />
      {isAuthenticated ? (
        <p>{user.username}</p>
      ) : (
        <div>
          <h2>Please login</h2>
          <h2>No video is available</h2>
        </div>
      )}
    </div>
  );
}

export default Home;
