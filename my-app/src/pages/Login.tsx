import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You'll connect this to your backend
    console.log("Login:", { email, password });
  };

  return (
    <div className="container" style={{ maxWidth: "400px", paddingTop: "60px" }}>
      <h1 className="page-title">Login</h1>
      <p className="page-subtitle">Welcome back to DeployStation</p>

      <form onSubmit={handleSubmit} className="card">
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
          Login
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text-muted)" }}>
        Don't have an account? <Link to="/signup" style={{ color: "var(--accent)" }}>Sign up</Link>
      </p>
    </div>
  );
}
