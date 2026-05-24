import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CenterDiv from "../components/CenterDiv";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "../components/ui/Button";

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
          setMessage(response.data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage("Verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed.");
      }
    };
    verify();
  }, [id, token]);

  return (
    <CenterDiv>
      <div className="max-w-md text-center">
        {status === "pending" && (
          <>
            <Loader2 className="mx-auto animate-spin text-violet-600" size={48} />
            <h1 className="mt-4 text-xl font-semibold">Verifying your email…</h1>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-emerald-500" size={48} />
            <h1 className="mt-4 text-xl font-semibold text-slate-900">{message}</h1>
            <Link to="/login" className="mt-6 inline-block">
              <Button text="Go to login" />
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500" size={48} />
            <h1 className="mt-4 text-xl font-semibold text-slate-900">{message}</h1>
          </>
        )}
      </div>
    </CenterDiv>
  );
}

export default VerifyEmail;
