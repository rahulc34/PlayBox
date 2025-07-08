import React, { useState } from "react";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isEmailVerify, setIsEmailVerify] = useState(false);

  const [otp, setOtp] = useState("");
  const [isOtpVerify, setIsOtpVerify] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConformPassword] = useState("");

  const emailVerifyHandler = async () => {
    try {
      const response = await axios.post("/api/v1/users/email-verify", {
        email,
      });
    } catch (error) {}
  };
  const otpVerifyHandler = async () => {
    try {
      const response = await axios.post("/api/v1/users/email-otpVerify", {
        email,
      });
    } catch (error) {}
  };
  const passwordChangeHandler = async () => {
    try {
      const response = await axios.post("/api/v1/users/reset-password", {
        email,
      });
    } catch (error) {}
  };
  return (
    <div>
      <h2>Reset Password</h2>
      {!isEmailVerify && (
        <form onSubmit={emailVerifyHandler}>
          <div>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <input type="submit" />
          </div>
        </form>
      )}
      {isEmailVerify && !isOtpVerify && (
        <form>
          <div>
            <label htmlFor="otp">Otp*</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your otp"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
      )}

      {isEmailVerify && isOtpVerify && (
        <form>
          <div>
            <label htmlFor="newPassword">New password*</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter your new password"
            />
          </div>
          <div>
            <label htmlFor="conformPassword">Conform new password*</label>
            <input
              type="password"
              id="conformPassword"
              name="conformPassword"
              placeholder="conform new password"
            />
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
