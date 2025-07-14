import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import Input from "../components/Input";
import Error from "../components/Error";

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
    <div className="box-container">
      <div>
        <p>Reset Password</p>
      </div>
      {isEmailSend ? (
        <p>Reset Link is send on email</p>
      ) : (
        <form onSubmit={formHandler}>
          <Input
            type="email"
            name="email"
            placeholder="Enter Your email"
            value={email}
            setValue={setEmail}
          />
          <div>
            <Button text={"submit"} />
          </div>
        </form>
      )}
      {errMsg && <Error message={errMsg} />}
    </div>
  );
}

export default ForgetPassword;
