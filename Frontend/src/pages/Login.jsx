import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../cssStyles/signUp.css";
import Input from "../components/Input";
import Button from "../components/Button";
import Error from "../components/Error";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, error } = useAuth();

  return (
    <div className="box-container">
      <div>
        <p>PlayBox</p>
      </div>

      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const credentials = { password, email };
          login({ credentials }, navigate);
        }}
      >
        <p>Please enter your details</p>
        <Input
          type="email"
          name="email"
          placeholder="Enter Your email"
          value={email}
          setValue={setEmail}
        />
        <Input
          type="password"
          name="password"
          placeholder="Enter Your password"
          value={password}
          setValue={setPassword}
        />
        <div>
          <Link to="/forgetPassword">Forgot Password</Link>
        </div>
        <div>
          <Button text={"submit"} />
        </div>
        <div>
          <div>
            don't have an account ?{" "}
            <span onClick={() => navigate("/signup")}>Signup </span>
          </div>
        </div>
      </form>
      {error && <Error message={error} />}
    </div>
  );
}

export default Login;
