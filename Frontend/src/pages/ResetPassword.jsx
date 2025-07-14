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
    <div className="box-container">
      <div>
        <p>Reset Password</p>
      </div>
      <form onSubmit={resetPassword}>
        <Input
          type="password"
          name="password"
          placeholder="Enter Your password"
          value={password}
          setValue={setPassword}
        />
        <Input
          type="password"
          name="conformPassword"
          placeholder="conform Your password"
          value={conformPassword}
          setValue={setConformPassword}
        />
        <div>
          <Button text={"submit"} />
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
