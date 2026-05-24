import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/ui/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Error from "../components/Error";
import { CheckCircle } from "lucide-react";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [isEmailSend, setIsEmailSend] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const formHandler = async (e) => {
    e.preventDefault();
    setIsEmailSend(false);
    setErrMsg("");
    try {
      const response = await axios.post("/api/v1/users/forget-password", {
        email,
      });
      if (response.data.success) {
        setIsEmailSend(true);
      } else {
        setErrMsg(response.data);
      }
    } catch (error) {
      setErrMsg(error.message);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll send a reset link to your email"
    >
      {isEmailSend ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle className="text-emerald-500" size={48} />
          <p className="font-medium text-slate-700">
            Reset link sent! Check your inbox.
          </p>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={formHandler}>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            setValue={setEmail}
          />
          <Button type="submit" text="Send reset link" className="w-full" />
        </form>
      )}
      {errMsg && <Error message={errMsg} />}
    </AuthLayout>
  );
}

export default ForgetPassword;
