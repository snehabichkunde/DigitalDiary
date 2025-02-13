import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../context/ContextProvider";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State for error message
    const navigate = useNavigate();
    const { user, login } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData && !user) {
                login(userData);
                navigate("/home");
            }
            axios.get("http://localhost:5000/api/auth/verify-token")
                .catch((error) => {
                    if (error.response && error.response.status === 403) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                    }
                });
        }
    }, [navigate, login, user]);

   const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            if (response.data.message === "Login successful") {
                const token = response.data.token;
                const userData = response.data.user;

                if (token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(userData));
                    login(userData);
                    console.log("Token and user saved successfully:", token);
                    navigate("/home");
                }
            } else {
                 if (response.data.message.includes("email")) {
                    setError("Invalid email address. Please check your email.");
                  } else if (response.data.message.includes("password")) {
                    setError("Invalid password. Please check your password.");
                  } else if (response.data.message.includes("credentials")) {
                    setError("Invalid email or password. Please check your credentials.");
                  }
                  else {
                    setError(response.data.message); // Set generic error message from the backend
                  }
            }
        } catch (err) {
            console.error("Error logging in:", err);
            if (err.response && err.response.data && err.response.data.message) {
                 if (err.response.data.message.includes("email")) {
                    setError("Invalid email address. Please check your email.");
                  } else if (err.response.data.message.includes("password")) {
                     setError("Invalid password. Please check your password.");
                  }else if(err.response.data.message.includes("credentials")) {
                    setError("Invalid email or password. Please check your credentials.");
                  }else{
                    setError(err.response.data.message);
                  }
            } else {
                setError("An error occurred during login. Please try again.");
            }
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
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit">Log In</button>
                    </form>
                    <div className="divider">
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>
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