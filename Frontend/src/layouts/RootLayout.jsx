import React, { useState, useRef, useEffect } from "react";
import "./RootLayout.css";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToggle } from "../contexts/ToggleSidebar.jsx";
import openMenu from "../assests/menu-bar.png";
import closeMenu from "../assests/close_menu_bar.png";
import logoutIcon from "../assests/logout.png";

function RootLayout() {
  const toggleRef = useRef();
  const { user, isVerified, isAuthenticated, logout, sendVerifyLink } =
    useAuth();
  const { isToggle, setIsToggle, isToggleBtnShow } = useToggle();
  const menuBarUrl = isToggle ? closeMenu : openMenu;
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
                style={{
                  border: "0",
                  backgroundColor: "inherit",
                  height: "35px",
                  width: "35px",
                }}
              >
                <img
                  src={menuBarUrl || null}
                  width={isToggle ? "32px" : "20px"}
                  alt="icon"
                />
              </button>
            )}
          </li>
          <li>
            <Link to="/">
              <p>Playbox</p>
            </Link>
          </li>
          <li>
            <input
              type="text"
              className="searchInput"
              placeholder="Search..."
              style={{
                minHeight: "42px",
                borderRadius: "24px",
                color: "black",
                fontWeight: "700",
                border: "1px solid black",
                paddingLeft: "9px",
              }}
            />
          </li>
          {isAuthenticated ? (
            <>
              <li className="dashboardButton">
                <Link to={`/user/${user.username}`}>
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
                <button
                  onClick={logout}
                  style={{
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    fontSize: "0.7rem",
                    backgroundColor: "inherit",
                  }}
                >
                  <img src={logoutIcon} alt="" width="17px" />
                  Logout
                </button>
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
