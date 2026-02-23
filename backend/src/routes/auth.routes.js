import express from "express"
import {login, signup} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    res.json({ message: "Logged out successfully" });
});

export default router