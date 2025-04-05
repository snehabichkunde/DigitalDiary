import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();

    useEffect(() => {
        if (location.pathname !== "/login" && location.pathname !== "/register") {
            sessionStorage.setItem("lastPath", location.pathname);
        }
    }, [location]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !user) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userData = JSON.parse(localStorage.getItem("user"));
            login(userData);
            navigate(sessionStorage.getItem("lastPath") || "/home");
        } else if (!token && location.pathname !== "/login") {
            navigate("/login");
        }
    }, [navigate, login, user, location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email.");
            return;
        }
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(
                "https://digitaldiary-vkw0.onrender.com/api/auth/login",
                { email, password }
            );
            if (data.message === "Login successful") {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                login(data.user);
                navigate(sessionStorage.getItem("lastPath") || "/home");
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(
                err.response?.status === 401
                    ? "Invalid email or password."
                    : "An error occurred. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-box">
                    <h1 className="auth-title">E-Diary</h1>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value.trim());
                                    setError("");
                                }}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>
                        <div className="input-group password-container">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value.trim());
                                    setError("");
                                }}
                                disabled={isLoading}
                                className="auth-input"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="auth-button"
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>
                    <div className="divider">
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>
                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register" className="auth-link">Sign Up</Link>
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
};

export default Login;