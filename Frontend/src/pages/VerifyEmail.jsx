import axios from "axios";
import React, { useState } from "react";

function VerifyEmail() {
  const [otp, setOtp] = useState("");

  const verifyOtpHandler = async () => {
    try {
      const response = await axios.post("api/v1/users/verifyChannel");
    } catch (error) {}
  };
  return (
    <div>
      <form onSubmit={verifyOtpHandler}>
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
    </div>
  );
}

export default VerifyEmail;
