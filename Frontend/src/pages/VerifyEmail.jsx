import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CenterDiv from "../components/CenterDiv";

function VerifyEmail() {
  const { id, token } = useParams();
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.post(
          `/api/v1/users/verify-email/${id}/${token}`
        );
        if (response.data.success) {
          setStatus("success");
          setMessage(data.data.message);
        } else {
          // console.log(response);
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response.data.message);
        // console.log(error);
      }
    };
    verify();
  }, [id, token]);

  if (status === "pending")
    return (
      <CenterDiv>
        <h1>Verifying your email...</h1>
      </CenterDiv>
    );
  if (status === "success")
    return (
      <CenterDiv>
        <h1>{message}</h1>
      </CenterDiv>
    );
  return (
    <CenterDiv>
      <h1>{message}</h1>{" "}
    </CenterDiv>
  );
}

export default VerifyEmail;
