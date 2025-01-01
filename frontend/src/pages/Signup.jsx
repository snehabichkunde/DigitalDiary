import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handdleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Create an Account</h2>
                <form style={styles.form} onSubmit={handdleSubmit}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="name" style={styles.label}>Name</label>
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
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            placeholder="*****"
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Sign Up</button>
                </form>
                <p style={styles.switchText}>
                    Already have an account?{" "}
                    <a href="/login" style={styles.link}>Log In</a>
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
        backgroundColor: "#f5f5f5",
        fontFamily: "'Arial', sans-serif",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px",
    },
    heading: {
        textAlign: "center",
        marginBottom: "1.5rem",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "1rem",
    },
    label: {
        marginBottom: "0.5rem",
        display: "block",
        color: "#555",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "0.8rem",
        borderRadius: "4px",
        border: "1px solid #ddd",
        fontSize: "1rem",
    },
    button: {
        padding: "0.8rem",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "bold",
    },
    switchText: {
        marginTop: "1rem",
        textAlign: "center",
        color: "#555",
    },
    link: {
        color: "#007BFF",
        textDecoration: "none",
        fontWeight: "bold",
    },
};

export default Signup;
