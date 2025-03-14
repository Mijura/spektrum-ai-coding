import express from "express"
import { router as projectRouter } from "@infrastructure/web/routes/project-routes"
import { corsMiddleware } from "@infrastructure/web/middleware/allow-requests"
import { serveProjectFilesMiddleware } from "@infrastructure/web/middleware/serve-project-files"
import { Server } from "socket.io"
import http from "http"

import dotenv from "dotenv"
import { codeGenerationWorkflow, projectStorage } from "@infrastructure/config/dependencies"
import { DevelopUserRequest } from "@application/use-cases/develop-user-request"

// Load environment variables from .env file
dotenv.config()

const app = express()

// Middlewares
app.use(corsMiddleware)
app.use(express.json())
// Routes
app.use("/", projectRouter)
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

	socket.on("develop", async ({ projectId, message }) => {
		console.log(`Starting development for ${projectId} with message: ${message}`)

		const developUserRequest = new DevelopUserRequest(projectStorage, codeGenerationWorkflow)

		const sendUpdate = (data: any) => {
			console.log(`Emitting update:`, data)
			socket.emit("update", data)
		}

		const sendFinal = (data:any) => {
			console.log("Sending final update", data)
			socket.emit("done", data)
			socket.disconnect()
		}

		// Attach listeners
		developUserRequest.on("update", sendUpdate)
		developUserRequest.on("done", sendFinal)


		// Clean up listeners when the client disconnects
		socket.on("disconnect", () => {
			console.log(`Client ${socket.id} disconnected, removing listeners...`)
			developUserRequest.off("update", sendUpdate)
			developUserRequest.off("done", sendFinal)
		})

		// Execute workflow
		try {
			await developUserRequest.execute(projectId, message)
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
