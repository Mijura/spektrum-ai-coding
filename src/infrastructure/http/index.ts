import express from "express"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

import { projectRouter } from "@infrastructure/http/routes/project-routes"
import { ticketRouter } from "@infrastructure/http/routes/ticket-routes"
import { corsMiddleware } from "@infrastructure/http/middleware/allow-requests"
import { serveProjectFilesMiddleware } from "@infrastructure/http/middleware/serve-project-files"
import { Server } from "socket.io"
import http from "http"

import { RunWorkflow } from "@application/use-cases/run-worfklow"
import { projectStorage, ticketStorage } from "@infrastructure/dependencies/web"



const app = express()

// Middlewares
app.use(corsMiddleware)
app.use(express.json())
// Routes
app.use("/", projectRouter)
app.use("/", ticketRouter)
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

	socket.on("run", async ({ projectId, ticketId, workflowId }) => {
		console.log(`Running workflow ${workflowId} for ${projectId} with ticketId: ${ticketId}`)

		const worfklow = new RunWorkflow(workflowId, projectStorage, ticketStorage)

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
		worfklow.on("update", sendUpdate)
		worfklow.on("done", sendFinal)


		// Clean up listeners when the client disconnects
		socket.on("disconnect", () => {
			console.log(`Client ${socket.id} disconnected, removing listeners...`)
			worfklow.off("update", sendUpdate)
			worfklow.off("done", sendFinal)
		})

		// Execute workflow
		try {
			await worfklow.run(projectId, ticketId)
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
