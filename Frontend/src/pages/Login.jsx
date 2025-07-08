import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();

  return (
    <div>
      <div>
        <p>PlayBox</p>
      </div>

      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const credentials = { password, email };
          login({ credentials });
          navigate("/");
        }}
      >
        <p>Please enter your details</p>
        <div>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required={true}
          />
        </div>
        <div>
          <label htmlFor="password">Password*</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Eneter your password"
            required={true}
          />
        </div>
        <div>
          <Link to="/resetPassword-otp">Forgot Password</Link>
        </div>
        <div>
          <button type="submit">LogIn</button>
        </div>
        <div>
          <div>
            don't have an account ?{" "}
            <span onClick={() => navigate("/signup")}>Signup </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
