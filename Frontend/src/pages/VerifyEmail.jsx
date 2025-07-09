import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function VerifyEmail() {
  const { id, token } = useParams();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.post(
          `/api/v1/users/verify-email/${id}/${token}`
        );
        if (response.data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    };
    verify();
  }, [id, token]);

  if (status === "pending") return <div>Verifying your email...</div>;
  if (status === "success") return <div>Email is verified!</div>;
  return <div>Something went wrong. Email could not be verified.</div>;
}

export default VerifyEmail;