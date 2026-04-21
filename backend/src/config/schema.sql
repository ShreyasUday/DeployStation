-- =====================
-- DeployStation Database Schema
-- =====================

-- Users table: supports email/password and GitHub OAuth authentication
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_github_id ON users(github_id);

-- Ensure at least one authentication method is present
ALTER TABLE users
ADD CONSTRAINT at_least_one_auth_method
CHECK (
    email IS NOT NULL
    OR github_id IS NOT NULL
);

-- Projects table: tracks deployed repositories and their container status
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    repo_name VARCHAR(255) NOT NULL,
    repo_url VARCHAR(255) NOT NULL,
    default_branch VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    container_id VARCHAR(100),
    port INTEGER,
    entry_point VARCHAR(200) DEFAULT 'index.js',
    app_port INTEGER DEFAULT 3000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Environment variables for deployed projects
CREATE TABLE project_env_vars (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    env_key VARCHAR(255) NOT NULL,
    env_value TEXT NOT NULL
);