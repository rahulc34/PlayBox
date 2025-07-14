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
import RootLayout from "./layouts/RootLayout.jsx";
import RedirectIfAuth from "./utils/RedirectIfAuth.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToggleProvider } from "./contexts/ToggleSidebar.jsx";

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
                <Route path="/user/:userId" element={<h1>userProfile</h1>} />
                <Route path="/video/:videoId" element={<VideoDetail />} />
                <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                <Route path="/mycontent" element={<h1>uservideo</h1>} />
                <Route path="/history" element={<h1>History</h1>} />
                <Route path="/subscribers" element={<h1>subscribers</h1>} />
                <Route path="/liked-video" element={<h1>liked videos</h1>} />
                <Route path="/collections" element={<h1>collections</h1>} />
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
