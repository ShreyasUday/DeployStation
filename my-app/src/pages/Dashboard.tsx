import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Replace with data from your backend API
const demoProjects: { id: string; name: string; url: string; status: string }[] = [];

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [githubError, setGithubError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchParams.get("error") === "github-linked") {
      setGithubError("This GitHub account is already linked to another account.");
      searchParams.delete("error");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (user?.github_id) {
      fetchRepos();
    }
  }, [user]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("http://localhost:3000/api/projects", {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchRepos = async () => {
    setLoadingRepos(true);
    try {
      const res = await fetch("http://localhost:3000/api/github/repos", {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
      }
    } catch (err) {
      console.error("Failed to fetch repos", err);
    } finally {
      setLoadingRepos(false);
    }
  };

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

      {user?.github_id && (
        <div style={{ marginTop: "40px" }}>
          <h2>Select a Repository to Deploy</h2>
          {loadingRepos ? (
            <p>Loading repositories...</p>
          ) : repos.length > 0 ? (
            <div className="project-list" style={{ marginTop: "16px" }}>
              {repos.map((repo) => (
                <div key={repo.id} className="card project-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h3 style={{ margin: 0 }}>{repo.name}</h3>
                      <span className={`status-badge ${repo.private ? "status-failed" : "status-live"}`} style={{ fontSize: "0.7rem", padding: "2px 6px" }}>
                        {repo.private ? "Private" : "Public"}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Default branch: {repo.default_branch}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/deploy?repo=${repo.name}&url=${repo.html_url}&branch=${repo.default_branch}`)} 
                    className="btn-primary" 
                    style={{ margin: 0, padding: "8px 16px" }}
                  >
                    Deploy
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No repositories found.</p>
          )}
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <h2>Your Projects</h2>
        {loadingProjects ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "60px", marginTop: "16px" }}>
            <h3 style={{ marginBottom: "12px" }}>No projects yet</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              Deploy your first project to get started
            </p>
            <button onClick={() => navigate("/deploy")} className="btn-primary">
              Deploy Project
            </button>
          </div>
        ) : (
          <div className="project-list" style={{ marginTop: "16px" }}>
            {projects.map((project) => (
              <div key={project.id} className="card project-card">
                <div>
                  <h3 style={{ margin: "0 0 8px 0" }}>{project.repo_name}</h3>
                  <a 
                    href={`http://localhost:3000/deployments/${project.id}/`} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ color: "var(--accent)", fontSize: "0.9rem" }}
                  >
                    Visit Site
                  </a>
                </div>
                <span className={`status-badge status-${project.status === 'live' ? 'live' : project.status === 'failed' ? 'failed' : 'pending'}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
