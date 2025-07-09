import { Server as HTTPServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import { Task } from "@domain/entities/task"
import { WorkflowRun } from "@domain/entities/task-execution"
import { eventBus } from "@domain/events/event-bus"

export function initializeActivityEmitter(server: HTTPServer) {
	const io = new SocketIOServer(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
			credentials: true,
		},
		transports: ["websocket", "polling"],
	})

	io.on("connection", (socket: Socket) => {
		console.log(`New client connected to task activity emitter: ${socket.id}`)

		socket.on("subscribe", (room: string) => {
			console.log(`Client ${socket.id} subscribed to room: ${room}`)

			socket.join(room)

			// Optional: send confirmation or backlog
			socket.emit("subscribed", { room })
		})

		socket.on("unsubscribe", (room: string) => {
			console.log(`Client ${socket.id} unsubscribed from room: ${room}`)
			socket.leave(room)
		})

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`)
		})
	})

	// Listen once on server-side and forward to specific room
	eventBus.on("task:update", (task: Task) => {
		console.log(`Broadcasting task:update to room ${task.projectId}`)
		io.to(task.projectId).emit("task:update", task)
	})

		// Listen once on server-side and forward to specific room
	eventBus.on("workflow-run:update", (workflowRun: WorkflowRun) => {
		console.log(`Broadcasting workflow-run:update to room ${workflowRun.accountId}`)
		io.to(workflowRun.accountId).emit("workflow-run:update", workflowRun)
	})
	
	eventBus.on("workflow-run:new", (workflowRun: WorkflowRun) => {
		console.log(`Broadcasting workflow-run:new to room ${workflowRun.accountId}`)
		io.to(workflowRun.accountId).emit("workflow-run:new", workflowRun)
	})
}
