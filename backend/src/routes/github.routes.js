import express from "express"
import verifyJWT from "../middleware/auth.middleware.js";
import { githubConnect, githubCallback, githubLogin, fetchRepos } from "../controllers/github.controller.js";

const router = express.Router();

router.get("/login", githubLogin)
router.get("/callback", githubCallback)
router.get("/connect", verifyJWT, githubConnect)
router.get("/repos", verifyJWT, fetchRepos)

export default router;
