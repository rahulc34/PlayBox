import React, { useState } from "react";
import axios from "axios";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  console.log("comonodfs");

  const formHandler = async (e) => {
    e.preventDefault();
    setIsEmailSend(false);
    setErrMsg("");
    try {
      const response = await axios.post("/api/v1/users/forget-password", {
        email,
      });

      console.log(response);
      if (response.data.success) {
        setIsEmailSend(true);
      } else {
        setErrMsg(response.data);
      }
    } catch (error) {
      console.log(error);
      setErrMsg(error.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {isEmailSend ? (
        <p>Reset Link is send on email</p>
      ) : (
        <form onSubmit={formHandler}>
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
            <button type="submit">submit</button>
          </div>
        </form>
      )}
      {errMsg ? <p>{errMsg}</p> : ""}
    </div>
  );
}

export default ForgetPassword;
