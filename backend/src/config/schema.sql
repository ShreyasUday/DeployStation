Run these in order:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,;
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