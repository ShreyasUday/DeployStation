# DeployStation

🚀 A Docker-based PaaS platform for deploying Node.js applications directly from GitHub — inspired by Heroku-style workflows.

Designed to automate application deployment, containerization, and lifecycle management in a self-hosted environment.

## 💡 Motivation

Deploying applications manually involves multiple steps — environment setup, dependency management, and runtime configuration.

DeployStation was built to simplify this into a single workflow, inspired by platforms like Heroku, while giving full control over the underlying infrastructure.

<p align="center">
  Full-stack system built using <strong>React</strong> · <strong>Node.js</strong> · <strong>PostgreSQL</strong> · <strong>Docker</strong>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **GitHub OAuth Integration** | Sign up/login via GitHub, or connect GitHub to an existing account. Securely stores OAuth tokens for repo access. |
| **Repository Selection** | Fetches the user's GitHub repositories via the GitHub API. Users select which repo to deploy from the dashboard. |
| **Docker-Based Build Pipeline** | Handles cloning repositories, building Docker images, and running applications in isolated containers (workflow under active refinement) |
| **Automatic Port Binding** | Containers are assigned dynamic host ports. A runtime patch (`patch.cjs`) transparently rewrites `localhost`/`127.0.0.1` bindings to `0.0.0.0` so containerized apps are accessible externally. |
| **Deployment Status Tracking** | Projects track status through `pending → building → live / failed`. The dashboard polls for real-time status updates. |
| **JWT Cookie Authentication** | Secure, httpOnly cookie-based auth with bcrypt password hashing. No localStorage tokens. |
| **Protected Routes** | Frontend enforces authentication via `AuthContext` and `ProtectedRoute` wrappers. |

---

## 🏗️ Architecture Overview

- **Backend API**: Handles user requests, authentication, and deployment triggers
- **Deployment Engine**: Clones repositories and manages Docker build/run lifecycle
- **Database (PostgreSQL)**: Stores users, projects, and deployment metadata
- **Container Layer (Docker)**: Ensures isolated runtime environments for each deployment

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│   (Vite + TypeScript + React Router)                     │
│                                                          │
│   Home ─── Login/Signup ─── Dashboard ─── Deploy         │
│                  │              │            │            │
│            AuthContext     Repo Picker   Deploy Form      │
└──────────────────┬──────────────┬───────────┬────────────┘
                   │              │           │
                   ▼              ▼           ▼
┌─────────────────────────────────────────────────────────┐
│                   Express.js Backend                     │
│                                                          │
│   /api/auth/*      →  Auth Controller  →  Auth Service   │
│   /api/github/*    →  GitHub Controller → GitHub Service │
│   /api/projects/*  →  Project Controller → Project Svc   │
│                                          → Build Service │
│                                                          │
│   Middleware: JWT verification (cookie-based)            │
└──────────────────┬──────────────────────────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
   ┌────────────┐   ┌─────────────┐
   │ PostgreSQL │   │   Docker    │
   │            │   │   Engine    │
   │ - users    │   │             │
   │ - projects │   │ ┌─────────┐ │
   │ - env_vars │   │ │Container│ │
   │            │   │ │  (app)  │ │
   └────────────┘   │ └─────────┘ │
                    └─────────────┘
```

---

## 🧠 Design Decisions

- **Why Docker**: Docker was chosen to ensure isolation between user deployments and reproducible environments — each app runs in its own container with no shared state.
- **Runtime Patching**: Node.js apps commonly bind to `localhost`, which is unreachable from outside a container. DeployStation injects a `--require` preload script that monkey-patches `net.Server.listen()` to bind to `0.0.0.0` instead — transparent to the deployed app.
- **Smart Entry Point Detection**: The builder script auto-detects how to start the app by checking `npm start`, `index.js`, `server.js`, `app.js`, and `src/` variants in order of priority.
- **Cookie-Based Auth**: JWT tokens are stored in httpOnly cookies (not localStorage), preventing XSS-based token theft. The frontend never touches the raw token.
- **GitHub Dual-Flow Auth**: Users can either sign up with email/password and later connect GitHub, or sign up directly via GitHub OAuth. Both flows converge on the same user record.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router v7 |
| **Backend** | Node.js, Express.js (ESM) |
| **Database** | PostgreSQL (via `pg` driver) |
| **Auth** | JWT, bcrypt, GitHub OAuth 2.0, httpOnly Cookies |
| **Containerization** | Docker (node:20-alpine base image) |
| **HTTP Client** | Axios (backend), Fetch API (frontend) |

---

## 📁 Project Structure

```
DeployStation/
├── backend/
│   ├── builder/                    # Docker build pipeline
│   │   ├── Dockerfile              # Container image for deployed apps
│   │   ├── script.sh               # Clone, install, build & run logic
│   │   └── patch.cjs               # Runtime localhost → 0.0.0.0 patch
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # PostgreSQL connection pool
│   │   │   └── schema.sql          # Database schema definitions
│   │   ├── controllers/
│   │   │   ├── auth.controller.js  # Login, signup, logout, getMe
│   │   │   ├── github.controller.js # OAuth flow, repo fetching
│   │   │   └── project.controller.js # Project CRUD & deploy trigger
│   │   ├── middleware/
│   │   │   └── auth.middleware.js   # JWT cookie verification
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── github.routes.js
│   │   │   └── project.routes.js
│   │   ├── services/
│   │   │   ├── auth.services.js     # User creation, login, bcrypt
│   │   │   ├── build.service.js     # Docker image build & container run
│   │   │   ├── github.services.js   # GitHub API integration
│   │   │   └── project.services.js  # Project DB operations
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   └── package.json
│
├── my-app/                          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Auth-aware navigation
│   │   │   └── ProtectedRoute.tsx   # Route guard component
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Global auth state management
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Login.tsx            # Email + GitHub login
│   │   │   ├── Signup.tsx           # Registration
│   │   │   ├── Dashboard.tsx        # Repo list + project status
│   │   │   └── Deploy.tsx           # Deployment configuration
│   │   ├── App.tsx                  # Route definitions
│   │   └── main.tsx                 # App entry with providers
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** v20+
- **PostgreSQL** running locally or remotely
- **Docker** installed and running
- **GitHub OAuth App** (for OAuth features)

### 1. Clone the repository

```bash
git clone https://github.com/ShreyasUday/DeployStation.git
cd DeployStation
```

### 2. Set up the database

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    password TEXT,
    github_id BIGINT UNIQUE,
    github_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    repo_name VARCHAR(255) NOT NULL,
    repo_url VARCHAR(255) NOT NULL,
    default_branch VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    container_id VARCHAR(100),
    port INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_env_vars (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    env_key VARCHAR(255) NOT NULL,
    env_value TEXT NOT NULL
);
```

### 3. Configure environment variables

Create `backend/.env`:

```env
DB_URL=postgresql://username:password@localhost:5432/deploystation
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=7d
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4. Install dependencies & run

```bash
# Backend
cd backend
npm install
node src/server.js

# Frontend (new terminal)
cd my-app
npm install
npm run dev
```

### 5. Build the Docker builder image

```bash
cd backend/builder
docker build -t deploystation-builder .
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (API).

---

## 🔄 Deployment Flow

```
User selects repo on Dashboard
        │
        ▼
POST /api/projects  →  Creates project record (status: "pending")
        │
        ▼
Build Service triggered asynchronously
        │
        ▼
docker build  →  Creates image from builder/Dockerfile
        │
        ▼
docker run -d -p 0:3000  →  Starts container with dynamic port
        │
        ▼
docker inspect  →  Detects mapped host port
        │
        ▼
DB updated  →  status: "live", port stored
        │
        ▼
Dashboard polls & shows "Live" badge + visit link
```

---

## 🚧 Current Status & Roadmap

Core backend and deployment workflow are implemented.
Currently improving Docker build reliability and container lifecycle stability.

**Implemented ✅**
- Full authentication system (email/password + GitHub OAuth)
- GitHub repository fetching and selection
- Docker image build and container lifecycle management
- Real-time deployment status tracking
- Protected frontend routes with auth state management

**In Progress 🔧**
- Improving Docker build pipeline reliability across diverse project structures
- Container lifecycle management (restart, stop, delete)
- Environment variable injection for deployed apps
- Deployment log streaming to frontend

**Planned 📋**
- Custom domain / subdomain mapping for deployed apps
- Queue-based deployment handling for concurrent builds
- Resource monitoring and container health checks
- Support for additional runtimes (Python, Go)

---

## 📄 License

This project is for educational and portfolio purposes.

---

<p align="center">
  Built by <a href="https://github.com/ShreyasUday">Shreyas Uday</a>
</p>
