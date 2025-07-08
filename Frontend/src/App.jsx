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

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
            path="/resetPassword-otp"
            element={
              <RedirectIfAuth>
                <ResetPassword />
              </RedirectIfAuth>
            }
          />
          <Route path="/verifyEmail-otp" element={<VerifyEmail />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
