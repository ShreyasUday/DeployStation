import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Deploy() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectName, setProjectName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const repoName = searchParams.get("repo");
    const url = searchParams.get("url");
    const defaultBranch = searchParams.get("branch");

    if (repoName) setProjectName(repoName);
    if (url) setRepoUrl(url);
    if (defaultBranch) setBranch(defaultBranch);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoName: projectName,
          repoURL: repoUrl,
          default_branch: branch,
        }),
        credentials: "include",
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create project");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Link to="/dashboard" style={{ color: "var(--text-muted)", marginBottom: "16px", display: "inline-block" }}>
        ← Back to Dashboard
      </Link>
      <h1 className="page-title">Deploy new project</h1>
      <p className="page-subtitle">Add your project to get a live URL</p>

      {error && (
        <div style={{ color: "var(--accent)", marginBottom: "16px", padding: "12px", border: "1px solid var(--accent)", borderRadius: "4px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: "500px" }}>
        <div className="input-group">
          <label>Project name</label>
          <input
            type="text"
            placeholder="my-awesome-app"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Repository URL</label>
          <input
            type="url"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Branch</label>
          <input
            type="text"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "12px" }}>
          {loading ? "Creating..." : "Confirm Deployment"}
        </button>
      </form>
    </div>
  );
}
