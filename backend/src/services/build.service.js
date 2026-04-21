import { exec } from "child_process"
import path from "path"
import pool from "../config/db.js"

const execPromise = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error || stderr)
            else resolve(stdout)
        })
    })
}

export const deployProject = async (projectId) => {
    try {
        const res = await pool.query(
            "select * from projects where id = $1", [projectId]
        )
        const project = res.rows[0]

        const { repo_url, default_branch, repo_name } = project
        await pool.query(
            "update projects set status = 'building' where id = $1", [projectId]
        )

        const buildPath = path.join(process.cwd(), "builder")
        const imageName = `project-${projectId}`
        console.log(`building image for ${repo_name}`)
        const imageBuildCommand = `docker build -t ${imageName} "${buildPath}"`
        await execPromise(imageBuildCommand)

        const containerName = `container-${projectId}`
        console.log(`starting container for ${repo_name}`)
        // Docker Run (using -p 0:3000 so Docker picks the port)
        const dockerRunCommand = `docker run -d --name ${containerName} -p 0:3000 ${imageName} ${repo_url} ${default_branch}`
        const containerId = await execPromise(dockerRunCommand)

        // Wait a small moment for the container and its networking to initialize
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Robust Port Detection: Try to find the host port for 3000/tcp
        const portCmd = `docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{if eq $p "3000/tcp"}}{{(index $conf 0).HostPort}}{{end}}{{end}}' ${containerName}`;
        let actualPort = await execPromise(portCmd)

        if (!actualPort || actualPort.trim() === "") {
            throw new Error("Could not detect a mapped port for the container. The app might have crashed or isn't listening on port 3000.")
        }

        await pool.query(
            "update projects set status = 'live', container_id = $1, port = $2 where id = $3",
            [containerId.trim(), parseInt(actualPort.trim()), projectId]
        )

        console.log(`project ${repo_name} is live on port ${actualPort.trim()}`)
    } catch (error) {
        console.error("deployment failed:", error)
        await pool.query(
            "update projects set status = 'failed' where id = $1", [projectId]
        )
    }
}