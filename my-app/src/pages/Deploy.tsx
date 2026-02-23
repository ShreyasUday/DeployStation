import { useState } from "react";
import { Link } from "react-router-dom";

export default function Deploy() {
  const [projectName, setProjectName] = useState("");
  const [framework, setFramework] = useState("react");
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You'll connect this to your backend
    console.log("Deploy:", { projectName, framework, repoUrl });
  };

  return (
    <div className="container">
      <Link to="/dashboard" style={{ color: "var(--text-muted)", marginBottom: "16px", display: "inline-block" }}>
        ← Back to Dashboard
      </Link>
      <h1 className="page-title">Deploy new project</h1>
      <p className="page-subtitle">Add your project to get a live URL</p>

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
          <label>Framework</label>
          <select value={framework} onChange={(e) => setFramework(e.target.value)}>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="next">Next.js</option>
            <option value="astro">Astro</option>
            <option value="static">Static HTML</option>
          </select>
        </div>
        <div className="input-group">
          <label>Repository URL</label>
          <input
            type="url"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <small style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "6px" }}>
            Paste your Git repo URL. Or upload files manually via your backend.
          </small>
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px" }}>
          Deploy
        </button>
      </form>
    </div>
  );
}
