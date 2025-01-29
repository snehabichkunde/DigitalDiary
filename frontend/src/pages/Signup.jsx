import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError(""); // Resetting error if any

        // Check if all fields are filled
        if (!name || !email || !password) {
            setEmailError("All fields are required!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            console.log(response.data); // Log the response to see the structure

            if (response.data.success) {
                alert(response.data.message); // 'Account created successfully'
                navigate('/');
            } else {
                console.log("Signup failed:", response.data.message);
                if (response.data.message === 'Email already exists') {
                     setEmailError('Email already exists. Please try another one or login.');
                }else {
                     setEmailError(response.data.message)
                 }

            }
        } catch (error) {
            console.error(error);
              if (error.response && error.response.data && error.response.data.message === 'Email already exists') {
                   setEmailError('Email already exists. Please try another one or login.');
               } else{
                    setEmailError('An error occurred during registration. Please try again.');
                }
        }
    };


    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Create an Account</h2>
                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="name" style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            id="name"
                            placeholder="Enter Name"
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter Email"
                            required
                            style={styles.input}
                        />
                           {emailError && <p style={styles.errorMessage}>{emailError}</p>}
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            placeholder="Enter Password"
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Sign Up</button>
                </form>
                <p style={styles.switchText}>
                    Already have an account?{" "}
                    <Link to="/" style={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #ff7e5f, #feb47b)", // Soft gradient background
        fontFamily: "'Roboto', sans-serif",
        padding: "0 20px", // Added padding for small screens
        boxSizing: "border-box",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "450px", // Ensuring max width
        textAlign: "center",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "1.5rem",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "1.2rem",
    },
    label: {
        marginBottom: "0.5rem",
        fontSize: "14px",
        color: "#333",
        fontWeight: "500",
    },
    input: {
        width: "100%",
        padding: "0.8rem",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        transition: "all 0.3s ease-in-out",
    },
    button: {
        padding: "0.8rem",
        backgroundColor: "#ff7e5f",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
    switchText: {
        marginTop: "1rem",
        fontSize: "14px",
        color: "#555",
    },
    link: {
        color: "#ff7e5f",
        textDecoration: "none",
        fontWeight: "bold",
    },

    // Media Queries for Responsiveness
    '@media (max-width: 768px)': {
        container: {
            padding: "0 10px", // Padding for mobile screens
        },
        card: {
            padding: "1.5rem", // Adjust padding for mobile screens
        },
        heading: {
            fontSize: "20px", // Smaller heading font on mobile
        },
        input: {
            fontSize: "12px", // Smaller font for inputs on mobile
        },
        button: {
            padding: "0.7rem", // Smaller button on mobile
        },
        switchText: {
            fontSize: "12px", // Smaller text for switch
        },
    },
  errorMessage: {
        color: "red",
        marginTop: "10px",
        fontSize: "0.9rem",
        textAlign: 'left'
    }
};

export default Signup;