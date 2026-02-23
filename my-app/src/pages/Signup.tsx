import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You'll connect this to your backend
    console.log("Signup:", { name, email, password });
  };

  return (
    <div className="container" style={{ maxWidth: "400px", paddingTop: "60px" }}>
      <h1 className="page-title">Create account</h1>
      <p className="page-subtitle">Start deploying your projects today</p>

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
