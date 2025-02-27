import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../context/ContextProvider";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();

    // Store last visited page in sessionStorage
    useEffect(() => {
        if (location.pathname !== "/login" && location.pathname !== "/register") {
            sessionStorage.setItem("lastPath", location.pathname);
        }
    }, [location]);

    // Check if user is logged in and redirect accordingly
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData && !user) {
                login(userData);
                const lastPath = sessionStorage.getItem("lastPath") || "/home"; // Default to home
                navigate(lastPath);
            }
        } else {
            navigate("/login");
        }
    }, [navigate, login, user]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("https://digitaldiary-vkw0.onrender.com/api/auth/login", {
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

                    // Redirect to last visited path
                    const lastPath = sessionStorage.getItem("lastPath") || "/home";
                    navigate(lastPath);
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Error logging in:", err);
            setError("An error occurred during login. Please try again.");
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
