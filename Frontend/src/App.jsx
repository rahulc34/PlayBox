import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  Home,
  Login,
  ResetPassword,
  VerifyEmail,
  ErrorPage,
  SignUp,
} from "./pages/index.js";
import RootLayout from "./layouts/RootLayout.jsx";
import RedirectIfAuth from "./utils/RedirectIfAuth.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/verifyEmail/:id/:token" element={<VerifyEmail />} />
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
