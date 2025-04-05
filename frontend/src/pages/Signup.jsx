import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("All fields are required!");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(
                "https://digitaldiary-vkw0.onrender.com/api/auth/register",
                { name, email, password }
            );
            if (data.success) {
                alert(data.message);
                navigate("/login");
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(
                err.response?.data?.message === "Email already exists"
                    ? "Email already exists. Please try another one or login."
                    : "An error occurred during registration. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-box">
                    <h2 className="auth-title">Join E-Diary</h2>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value.trim());
                                    setError("");
                                }}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>
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
                            {isLoading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>
                    <div className="divider">
                        <hr />
                        <span>OR</span>
                        <hr />
                    </div>
                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link">Login</Link>
                    </p>
                </div>
                <div className="info-box">
                    <p className="quote">
                        “The life of man is of a span length; diary makes it eternal.” <br />
                        — <strong>Adapted from Seneca</strong>
                    </p>
                    <p>
                        Capture your thoughts, dreams, and moments. Begin your journaling
                        adventure with E-Diary today.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;