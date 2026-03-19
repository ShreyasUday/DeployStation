import pool from "../config/db.js"

export async function createProject({ userId, repoName, repoURL, default_branch }) {
    const result = await pool.query(
        "insert into Projects (user_id,repo_name,repo_url,default_branch) values ($1,$2,$3,$4) returning *",
        [userId, repoName, repoURL, default_branch]
    )
    return result.rows[0]
}

export async function getUserProjects(userId) {
    const result = await pool.query(
        "select * from Projects where user_id = $1 order by created_at desc", [userId]
    )
    return result.rows
}

export async function getProjectById(projectId, userId) {
    const result = await pool.query(
        "select * from Projects where id = $1 and user_id = $2", [projectId, userId]
    )
    return result.rows[0]
}