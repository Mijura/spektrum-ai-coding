import express from "express"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

import { projectRouter } from "@infrastructure/http/routes/project-routes"
import { issueRouter } from "@infrastructure/http/routes/issue-routes"
import { corsMiddleware } from "@infrastructure/http/middleware/allow-requests"
import { serveProjectFilesMiddleware } from "@infrastructure/http/middleware/serve-project-files"
import { Server } from "socket.io"
import http from "http"

import { RunWorkflowUseCase } from "@application/use-cases/workflow/run-worfklow"
import { projectRepository, issueRepository } from "@infrastructure/dependencies"
import { workflowRunRouter } from "./routes/workflow-run-routes"
import { eventBus } from "@domain/services/event-bus"



const app = express()

// Middlewares
app.use(corsMiddleware)
app.use(express.json())
// Routes
app.use("/", projectRouter)
app.use("/", issueRouter)
app.use("/", workflowRunRouter)
app.use("/:id", serveProjectFilesMiddleware)


const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "*", // TEMP: Allow all origins for testing
		methods: ["GET", "POST"],
		credentials: true,
	},
	transports: ["websocket", "polling"],
})

io.on("connection", (socket) => {
	console.log(`New client connected: ${socket.id}`)

	socket.on("run", async ({ projectId, issueId, workflowId }) => {
		console.log(`Running workflow ${workflowId} for ${projectId} with issueId: ${issueId}`)

		const worfklow = new RunWorkflowUseCase(workflowId, projectRepository, issueRepository)

		const sendUpdate = (data: any) => {
			console.log(`Emitting update:`, data)
			socket.emit("update", data)
		}

		const sendFinal = (data:any) => {
			console.log("Sending final update", data)
			socket.emit("done", data)
			socket.disconnect()
		}

		// Attach global event listeners
		eventBus.on("issue:update", sendUpdate);

		socket.on("disconnect", () => {
			eventBus.off("issue:update", sendUpdate);
		});

		// Execute workflow
		try {
			await worfklow.run(projectId, issueId)
		} catch (error) {
			console.error("Error during development workflow:", error)
			socket.emit("error", { message: "An error occurred during development" })
			socket.disconnect()
		}
	})

	socket.on("disconnect", () => {
		console.log(`Client disconnected: ${socket.id}`)
	})
})



server.listen(3000, () => {
	console.log("Server running on http://localhost:3000")
})
