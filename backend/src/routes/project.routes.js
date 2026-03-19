import express from "express"
import { getProjects, createProject, getProjectById } from "../controllers/project.controller.js"
import verifyJWT from "../middleware/auth.middleware.js"

const router = express.Router()

router.use(verifyJWT)

router.get("/", getProjects)
router.post("/", createProject)
router.get("/:id", getProjectById)

export default router