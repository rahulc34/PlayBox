import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  Home,
  Login,
  ResetPassword,
  VerifyEmail,
  ErrorPage,
  SignUp,
  Sidebar,
  VideoDetail,
} from "./pages/index.js";

import {
  Dashboard,
  VideosList,
  Playlist,
  LikedVideo,
  History,
  Subscribers,
} from "./pages/userPages/index.js";

import RootLayout from "./layouts/RootLayout.jsx";
import RedirectIfAuth from "./utils/RedirectIfAuth.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToggleProvider } from "./contexts/ToggleSidebar.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PlaylistDetail from "./components/PlaylistDetail.jsx";
import SubscribedTo from "./pages/userPages/SubscribedTo.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToggleProvider>
          <Routes>
            <Route path="/verifyEmail/:id/:token" element={<VerifyEmail />} />
            <Route path="/" element={<RootLayout />}>
              <Route path="/" element={<Sidebar />}>
                <Route path="/" element={<Home />} />
                <Route path="/user/:username" element={<UserProfile />} />
                <Route path="/video/:videoId" element={<VideoDetail />} />
                <Route
                  path="/playlist/:playlistId"
                  element={<PlaylistDetail />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/mycontent" element={<VideosList />} />
                <Route path="/history" element={<History />} />
                <Route path="/subscribers" element={<Subscribers />} />
                <Route path="/subscribedTo" element={<SubscribedTo />} />
                <Route path="/liked-video" element={<LikedVideo />} />
                <Route path="/collections" element={<Playlist />} />
                <Route path="/support" element={<h1>support</h1>} />
                <Route path="setting" element={<h1>setting</h1>} />
              </Route>
              <Route
                path="/login"
                element={
                  <RedirectIfAuth>
                    <Login />
                  </RedirectIfAuth>
                }
              />
              <Route
                path="/signup"
                element={
                  <RedirectIfAuth>
                    <SignUp />
                  </RedirectIfAuth>
                }
              />
              <Route
                path="/forgetPassword"
                element={
                  <RedirectIfAuth>
                    <ForgetPassword />
                  </RedirectIfAuth>
                }
              />
              <Route
                path="/resetPassword/:id/:token"
                element={
                  <RedirectIfAuth>
                    <ResetPassword />
                  </RedirectIfAuth>
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </ToggleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
