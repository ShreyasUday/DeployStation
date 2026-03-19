import crypto from "crypto"
import pool from "../config/db.js"


const userState = {};
export async function prepareGithubConnect(userId) {
    const state = crypto.randomBytes(16).toString("hex");
    if (userId) {
        userState[state] = userId;
    }
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo&state=${state}`;
    return { state, url, userId }
}

export async function getAndClearUserState(state) {
    if (state && userState[state]) {
        const userId = userState[state];
        delete userState[state];
        return userId;
    }
    return null;
}

export async function githubFullToken(code) {
    const result = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        })
    })
    return result
}

export async function fetchGithubUser(accessToken) {
    const result = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    return result
}


export async function fetchUserRepo(userId) {
    const user = await pool.query(
        "select github_token from users where id = $1", [userId]
    )
    const token = user.rows[0]?.github_token
    if (!token) {
        throw new Error("GitHub not connected")
    }
    const response = await fetch("https://api.github.com/user/repos", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (!response.ok) {
        throw new Error("Failed to fetch repositories from GitHub")
    }

    const repos = await response.json()
    return repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        private: repo.private,
        default_branch: repo.default_branch,
        html_url: repo.html_url
    }))
}