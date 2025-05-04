// infrastructure/http/sockets/initializeIssueActivityEmitter.ts
import { Server as HTTPServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import { eventBus } from "@domain/services/event-bus"
import { Issue } from "@domain/entities/issue"

export function initializeIssueActivityEmitter(server: HTTPServer) {
	const io = new SocketIOServer(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
			credentials: true,
		},
		transports: ["websocket", "polling"],
	})

	io.on("connection", (socket: Socket) => {
		console.log(`New client connected: ${socket.id}`)

		socket.on("subscribe", (projectId: string) => {
			console.log(`Client ${socket.id} subscribed to project ${projectId}`)

			socket.join(projectId)

			// Optional: send confirmation or backlog
			socket.emit("subscribed", { projectId })
		})

		socket.on("unsubscribe", (projectId: string) => {
			console.log(`Client ${socket.id} unsubscribed from project ${projectId}`)
			socket.leave(projectId)
		})

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`)
		})
	})

	// Listen once on server-side and forward to specific room
	eventBus.on("issue:update", (issue: Issue) => {
		console.log(`Broadcasting issue:update to room ${issue.projectId}`)
		io.to(issue.projectId).emit("issue:update", issue)
	})
}
