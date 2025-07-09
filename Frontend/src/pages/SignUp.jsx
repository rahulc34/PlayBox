import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isAuthenticated } = useAuth();
  const userRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  return (
    <div>
      <div>
        <p>PlayBox</p>
      </div>

      <h2>Sign Up</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const credentials = { username, fullname, email, password };
          signup(credentials, navigate);
        }}
      >
        <p>create your account</p>
        <div>
          <label htmlFor="username">Username*</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            ref={userRef}
            placeholder="Eneter your username"
            required
          />
        </div>
        <div>
          <label htmlFor="fullname">Fullname*</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value);
            }}
            placeholder="Eneter your fullname"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Enter your email"
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password*</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Eneter your password"
            required
          />
        </div>
        <div>
          <Link to="/forgetPassword">Forgot Password</Link>
        </div>
        <div>
          <input type="submit" />
        </div>
        <div>
          <div>
            Already Have an account ?{" "}
            <span
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
