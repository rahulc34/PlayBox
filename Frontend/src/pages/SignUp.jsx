import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../cssStyles/signUp.css";
import Input from "../components/Input";
import Button from "../components/Button";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isAuthenticated } = useAuth();
  const userRef = useRef();

  return (
    <div className="box-container">
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
        <Input
          type="text"
          name="username"
          placeholder="Enter Your name"
          value={username}
          setValue={setUsername}
        />
        <Input
          type="text"
          name="fullname"
          placeholder="Enter Your fullname"
          value={fullname}
          setValue={setFullname}
        />
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
