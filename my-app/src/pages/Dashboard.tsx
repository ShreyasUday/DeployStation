import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Replace with data from your backend API
const demoProjects: { id: string; name: string; url: string; status: string }[] = [];

export default function Dashboard() {
  const [projects] = useState(demoProjects);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [githubError, setGithubError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "github-linked") {
      setGithubError("This GitHub account is already linked to another account.");
      // Optional: Clean up the URL
      searchParams.delete("error");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleConnectGitHub = () => {
    window.location.href = "http://localhost:3000/api/github/connect";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your deployed projects</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexDirection: "column", alignItems: "flex-end" }}>
          {githubError && (
            <div style={{ color: "var(--accent)", marginBottom: "8px", fontSize: "0.9rem", padding: "8px", border: "1px solid var(--accent)", borderRadius: "4px" }}>
              {githubError}
            </div>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            {user?.github_id ? (
              <button disabled className="btn-github" style={{ margin: 0, width: "auto", opacity: 0.7, cursor: "not-allowed" }}>
                GitHub Connected ✅
              </button>
            ) : (
              <button onClick={handleConnectGitHub} className="btn-github" style={{ margin: 0, width: "auto" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Connect GitHub
              </button>
            )}
            <button onClick={handleLogout} className="btn-outline">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "24px", borderLeft: "4px solid var(--accent)" }}>
        <h3 style={{ marginBottom: "8px" }}>Account Status</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Logged in as <span style={{ color: "var(--text)", fontWeight: "600" }}>{user?.name || "Authenticated User"}</span>
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <h3 style={{ marginBottom: "12px" }}>No projects yet</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Deploy your first project to get started
          </p>
          <button onClick={() => navigate("/deploy")} className="btn-primary">
            Deploy Project
          </button>
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
