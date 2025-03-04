import express, { NextFunction, Request, Response } from "express"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

import dotenv from "dotenv"
import { setupProject } from "src/refactoring/use-cases/setup-new-project"
import { ProjectDto } from "src/refactoring/dto/project"
import { ChangeRequestDto } from "src/refactoring/dto/change-request"
import { implementRequest } from "src/refactoring/use-cases/implement-request"

// Load environment variables from .env file
dotenv.config()

const PORT = 3000

const app = express()

// Middleware to parse JSON requests
app.use(express.json())

app.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*") // Allow requests from any origin
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS") // Include OPTIONS
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization") // Allow these headers

	// Handle preflight requests
	if (req.method === "OPTIONS") {
		res.sendStatus(204) // No content for preflight requests
		return
	}

	next()
})

// Project intialization
app.post("/project/new", async (req: Request, res: Response) => {
	try {
		const id = uuidv4()
		await setupProject(id)
		res.json({ message: "Project built successfully.", id })
	} catch (error) {
		console.error("Error setting up project:", error)
		res.status(500).json({ error: `Error setting up project: ${error}` })
	}
})

app.get("/project/fetch/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		
		const project: ProjectDto = { id: id }
		res.json(project)
	} catch (error) {
		res.status(500).json({ error: `Error fetching source code: ${error}` })
	}
})

app.put("/project/implement", async (req: Request, res: Response) => {
	try {
		const changeRequest: ChangeRequestDto = req.body

		console.log(changeRequest)
		await implementRequest(changeRequest)
		res.json({ message: "Feacture successfully implemented." })
	} catch (error) {
		console.error("Error rebuilding project:", error)
		res.status(500).json({ error: `Error rebuilding project: ${error}` })
	}
})

// Middleware to serve static files
app.use("/:id", (req: Request, res: Response, next: NextFunction) => {
	const projectPath = path.resolve(`projects/${req.params.id}/dist`)

	if (fs.existsSync(projectPath)) {
		express.static(projectPath)(req, res, next)
	} else {
		res.status(404).send("Project not found")
	}
})

// Serve index.html when accessing `/id`
app.get("/:id", (req: Request, res: Response) => {
	const projectPath = path.resolve(`projects/${req.params.id}/dist/index.html`)

	if (fs.existsSync(projectPath)) {
		res.sendFile(projectPath)
	} else {
		res.status(404).send("Project not found")
	}
})

// Start the server
app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
