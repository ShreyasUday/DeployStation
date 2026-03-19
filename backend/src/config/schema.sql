Run these in order:

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

Optional constraint:

ALTER TABLE users
ADD CONSTRAINT at_least_one_auth_method
CHECK (
    email IS NOT NULL
    OR github_id IS NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    repo_name VARCHAR(255) NOT NULL,
    repo_url VARCHAR(255) NOT NULL,
    default_branch VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
