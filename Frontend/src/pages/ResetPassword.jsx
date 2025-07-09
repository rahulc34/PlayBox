import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [matchPassword, setmatchPassword] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const resetPassword = async (e) => {
    e.preventDefault();
    console.log(id, "  ", token);
    try {
      const response = await axios.post(
        `/api/v1/users/reset-password/${id}/${token}`,
        {
          newPassword: password,
        }
      );

      console.log(response);
      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={resetPassword}>
        <div>
          <label htmlFor="newPassword">New password*</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setmatchPassword(password === conformPassword);
            }}
            placeholder="Enter your new password"
            required
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="conformPassword">Conform new password*</label>
          <input
            type="password"
            id="conformPassword"
            name="conformPassword"
            value={conformPassword}
            onChange={(e) => {
              setConformPassword(e.target.value);
              setmatchPassword(password === conformPassword);
            }}
            placeholder="Enter your new password"
            required
            autoComplete="off"
          />
        </div>
        <div>
          <input type="submit" value="submit" />
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
