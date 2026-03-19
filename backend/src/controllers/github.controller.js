import jwt from "jsonwebtoken"
import pool from "../config/db.js"


import { githubFullToken, prepareGithubConnect, getAndClearUserState, fetchGithubUser, fetchUserRepo } from "../services/github.services.js"



export const githubConnect = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null
        const { url } = await prepareGithubConnect(userId)
        res.redirect(url);
    } catch (error) {
        console.error("Error in githubConnect:", error);
        res.status(500).json({ error: "Failed to connect to GitHub" });
    }
}

export const githubCallback = async (req, res) => {
    const { code, state } = req.query;

    const userId = await getAndClearUserState(state)
    if (!code) {
        return res.redirect("http://localhost:5173/login");
    }
    try {
        const fulltoken = await githubFullToken(code)
        const tokendata = await fulltoken.json();
        const accessToken = tokendata.access_token;

        if (!accessToken) {
            return res.redirect("http://localhost:5173/login?error=github_token_missing");
        }

        const userRes = await fetchGithubUser(accessToken)
        const githubUser = await userRes.json();
        const githubUserId = githubUser.id;
        const githubEmail = githubUser.email;
        const githubUsername = githubUser.login;
        if (userId) {

            const existingGithubUser = await pool.query(
                "select id from users where github_id = $1", [githubUserId]
            )

            if (existingGithubUser.rows.length > 0 && existingGithubUser.rows[0].id !== userId) {
                return res.redirect("http://localhost:5173/dashboard?error=github-linked");
            }

            await pool.query("update users set github_token = $1, github_id = $2 where id = $3", [accessToken, githubUserId, userId]);
            return res.redirect("http://localhost:5173/dashboard")
        }
        const existing = await pool.query("select * from users where github_id = $1", [githubUserId]);

        if (existing.rows.length > 0) {
            const user = existing.rows[0];

            await pool.query(
                "UPDATE users SET github_token = $1 WHERE id = $2",
                [accessToken, user.id]
            );
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES }
            );
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // true in production (https)
                sameSite: "lax"
            });
            return res.redirect("http://localhost:5173/dashboard")
        }
        else {
            const newUser = await pool.query("insert into users (name, email, github_id, github_token, password) values ($1, $2, $3, $4, $5) returning *",
                [githubUsername, githubEmail, githubUserId, accessToken, null]);
            const user = newUser.rows[0];
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES }
            )
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // true in production (https)
                sameSite: "lax"
            });
            return res.redirect("http://localhost:5173/dashboard")
        }

    } catch (error) {
        console.error("Error in githubCallback:", error);
        res.status(500).json({ error: "Failed to connect to GitHub" });
    }
}

export const githubLogin = (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
    res.redirect(url);
}

export const fetchRepos = async (req, res) => {
    try {
        const repos = await fetchUserRepo(req.user.userId)
        res.json(repos)
    } catch (error) {
        if (error.message === "GitHub not connected") {
            return res.status(400).json({ message: "GitHub not connected" })
        }
        return res.status(500).json({ message: error.message })
    }
}