import * as projectServices from "../services/project.services.js"

export const createProject = async (req, res) => {
    try {
        const { repoName, repoURL, default_branch } = req.body
        const project = await projectServices.createProject({
            userId: req.user.userId,
            repoName,
            repoURL,
            default_branch
        })
        return res.status(200).json({ project })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const getProjects = async (req, res) => {
    try {
        const projects = await projectServices.getUserProjects(req.user.userId)
        if (!projects) {
            return res.status(404).json({ message: "Project not Found" })
        }
        return res.status(200).json(projects)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const getProjectById = async (req, res) => {
    try {
        const project = await projectServices.getProjectById(req.params.id, req.user.userId)
        if (!project) {
            return res.status(404).json({ message: "Project not Found" })
        }
        return res.status(200).json(project)

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}