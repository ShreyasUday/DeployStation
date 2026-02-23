import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Deploy your frontend in minutes</h1>
        <p>
          Upload your React, Vue, or static site. We handle the rest. 
          No servers, no configs — just deploy and go.
        </p>
        <Link to="/signup" className="btn-primary" style={{ fontSize: "1.1rem", padding: "14px 28px" }}>
          Get Started
        </Link>
      </section>

      <section className="features">
        <h2>Simple hosting for frontend devs</h2>
        <div className="feature-grid">
          <div className="card feature-card">
            <h3>Upload & Deploy</h3>
            <p>Drag and drop your build folder or connect a Git repo. One click to go live.</p>
          </div>
          <div className="card feature-card">
            <h3>Custom URLs</h3>
            <p>Each project gets a unique URL. Preview links for every deployment.</p>
          </div>
          <div className="card feature-card">
            <h3>Framework support</h3>
            <p>React, Vue, Next.js, Astro, plain HTML — we support it all.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
