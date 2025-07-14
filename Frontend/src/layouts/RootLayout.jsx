import React, { useState, useRef, useEffect } from "react";
import "./RootLayout.css";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToggle } from "../contexts/ToggleSidebar.jsx";

function RootLayout() {
  const toggleRef = useRef();
  const { user, isVerified, isAuthenticated, logout, sendVerifyLink } =
    useAuth();
  const { isToggle, setIsToggle, isToggleBtnShow } = useToggle();
  return (
    <>
      <header>
        <ul>
          <li className="btnToggle" ref={toggleRef}>
            {isToggleBtnShow && (
              <button
                onClick={() => {
                  setIsToggle(!isToggle);
                }}
              >
                {isToggle ? "close" : "open"}
              </button>
            )}
          </li>
          <li>
            <Link to="/">
              <p>Playbox</p>
            </Link>
          </li>
          <li>
            <input type="text" placeholder="Search..." />
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard">
                  <p>{user.username[0].toUpperCase()}</p>
                </Link>
              </li>
              {!isVerified && (
                <li>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendVerifyLink();
                    }}
                  >
                    <button type="submit">verify</button>
                  </form>
                </li>
              )}
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
    </>
  );
}

export default RootLayout;
