import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/ui/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Playbox and start sharing"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          signup({ username, fullname, email, password }, navigate);
        }}
      >
        <Input
          type="text"
          name="username"
          placeholder="johndoe"
          value={username}
          setValue={setUsername}
        />
        <Input
          type="text"
          name="fullname"
          placeholder="John Doe"
          value={fullname}
          setValue={setFullname}
          label="full name"
        />
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
          placeholder="Create a password"
          value={password}
          setValue={setPassword}
        />
        <Button type="submit" text="Create account" className="w-full" />
      </form>
    </AuthLayout>
  );
}

export default SignUp;
