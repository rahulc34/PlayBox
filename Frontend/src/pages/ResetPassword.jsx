import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/ui/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  const resetPassword = async (e) => {
    e.preventDefault();
    if (password !== conformPassword) return;
    try {
      const response = await axios.post(
        `/api/v1/users/reset-password/${id}/${token}`,
        { newPassword: password }
      );
      if (response.data.success) navigate("/login");
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthLayout title="New password" subtitle="Choose a strong password">
      <form className="flex flex-col gap-4" onSubmit={resetPassword}>
        <Input
          type="password"
          name="password"
          placeholder="New password"
          value={password}
          setValue={setPassword}
        />
        <Input
          type="password"
          name="confirm"
          label="confirm password"
          placeholder="Confirm password"
          value={conformPassword}
          setValue={setConformPassword}
        />
        <Button type="submit" text="Reset password" className="w-full" />
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
