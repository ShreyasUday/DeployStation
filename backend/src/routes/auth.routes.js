import express from "express"
import {login, logout, signup, getMe} from "../controllers/auth.controller.js"
import verifyJWT from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/logout", logout)
router.get("/me",verifyJWT,getMe)

export default router