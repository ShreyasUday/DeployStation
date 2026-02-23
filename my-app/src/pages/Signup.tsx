import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        login();
        navigate("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", paddingTop: "60px" }}>
      <h1 className="page-title">Create account</h1>
      <p className="page-subtitle">Start deploying your projects today</p>

      {error && (
        <div style={{ color: "var(--accent)", marginBottom: "16px", fontSize: "0.9rem", textAlign: "center" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px" }}>
          Sign Up
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text-muted)" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--accent)" }}>Login</Link>
      </p>
    </div>
  );
}
