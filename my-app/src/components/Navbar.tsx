import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        DeployStation
      </Link>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/deploy">Deploy</Link>
        <Link to="/login" className="btn-outline">Login</Link>
        <Link to="/signup" className="btn-primary">Sign Up</Link>
      </div>
    </nav>
  );
}
