import { Link } from "react-router-dom";
import { useState } from "react";

// Replace with data from your backend API
// Example: [{ id: "1", name: "My App", url: "https://myapp.deploystation.app", status: "live" }]
const demoProjects: { id: string; name: string; url: string; status: string }[] = [];

export default function Dashboard() {
  const [projects] = useState(demoProjects);

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Your deployed projects</p>

      <Link to="/deploy" className="btn-primary" style={{ marginBottom: "24px" }}>
        + New Project
      </Link>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <h3 style={{ marginBottom: "12px" }}>No projects yet</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Deploy your first project to get started
          </p>
          <Link to="/deploy" className="btn-primary">
            Deploy Project
          </Link>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div key={project.id} className="card project-card">
              <div>
                <h3 style={{ margin: "0 0 8px 0" }}>{project.name}</h3>
                <a href={project.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "0.9rem" }}>
                  {project.url}
                </a>
              </div>
              <span className="status-badge status-live">{project.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
