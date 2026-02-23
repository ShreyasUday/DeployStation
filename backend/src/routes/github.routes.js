import express from "express"
import axios from "axios"
import verifyJWT from "../middleware/auth.middleware.js";
import pool from "../config/db.js"
import crypto from "crypto"
import jwt from "jsonwebtoken"

const router = express.Router();
const userState = {};

router.get("/connect", verifyJWT, (req, res) => {
    const userId = req.user.userId;
    const state = crypto.randomBytes(16).toString("hex");
    userState[state] = userId;
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo&state=${state}`;
    res.redirect(url);
});

router.get("/callback", async (req, res) => {
    const { code, state } = req.query;
    let userId = null;
    if (state && userState[state]) {
        userId = userState[state];
        delete userState[state];
    }
    if (!code) {
        return res.redirect("http://localhost:5173/login");
    }
    try {
        const fulltoken = await fetch("https://github.com/login/oauth/access_token", {
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
        const tokendata = await fulltoken.json();
        const accessToken = tokendata.access_token;
        // if(!accessToken)

        if (userId) {
            await pool.query("update users set github_token = $1 where id = $2", [accessToken, userId]);
            return res.redirect("http://localhost:5173")
        }
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const githubUser = await userRes.json();
        const githubUserId = githubUser.id;
        const githubUsername = githubUser.login;
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
            return res.redirect("http://localhost:5173")
        }
        else {
            const newUser = await pool.query("insert into users (name, github_id, github_token, password) values ($1, $2, $3, $4) returning *",
                [githubUsername, githubUserId, accessToken, null]);
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
            return res.redirect("http://localhost:5173")
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "OAuth failed" })
    }
})

router.get("/login", (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
    res.redirect(url);
})

export default router;