import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function RootLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      <header>
        <ul>
          <li>
            <Link to="/">
              <p>Playbox</p>
            </Link>
          </li>
          <li>
            <input type="text" placeholder="search something" />
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard">
                  <p>{user.username[0].toUpperCase()}</p>
                </Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              {" "}
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">SignUp</Link>
              </li>
            </>
          )}
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
