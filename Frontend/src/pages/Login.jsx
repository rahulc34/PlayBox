import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/ui/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Error from "../components/Error";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue watching"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-violet-600 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          login({ credentials: { password, email } }, navigate);
        }}
      >
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          setValue={setEmail}
        />
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          value={password}
          setValue={setPassword}
        />
        <Link
          to="/forgetPassword"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          Forgot password?
        </Link>
        <Button type="submit" text="Sign in" className="w-full" />
      </form>
      {error && <Error message={error} />}
    </AuthLayout>
  );
}

export default Login;
