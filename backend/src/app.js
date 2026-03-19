import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import githubRoutes from "./routes/github.routes.js"
import projectRoutes from "./routes/project.routes.js"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/github", githubRoutes)
app.use("/api/projects", projectRoutes)

export default app