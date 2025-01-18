import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        console.log("login successfully");
        navigate("/home");
      } else {
        console.log("Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="content-container">
        <div className="login-box">
          <h1>E-Diary</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Log In</button>
          </form>
          <div className="divider">
            <hr />
            <span>OR</span>
            <hr />
          </div>
          <button className="social-login">Log in with Google</button>
          <p className="signup-text">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
        <div className="info-box">
          <p className="quote">
            “Keep a diary, and someday it will keep you.” <br />
            — <strong>Mae West</strong>
          </p>
          <p>
            Journaling isn’t just about keeping memories; it’s about embracing
            self-reflection. Start your journey today with E-Diary.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
