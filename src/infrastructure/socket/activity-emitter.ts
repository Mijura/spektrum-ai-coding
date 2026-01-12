import { TaskExecution } from "@jigjoy-io/observability-client"
import { Server as SocketIOServer, Socket } from "socket.io"
import { eventBus } from "@application/events/event-bus"
import { Task } from "@jigjoy-io/task-contracts"
import { Server as HTTPServer } from "http"

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
	eventBus.on("task-execution:update", (taskExecution: TaskExecution) => {
		console.log(`Broadcasting task-execution:update to room ${taskExecution.accountId}`)
		io.to(taskExecution.accountId).emit("task-execution:update", taskExecution)
	})

	eventBus.on("task-execution:new", (taskExecution: TaskExecution) => {
		console.log(`Broadcasting task-execution:new to room ${taskExecution.accountId}`)
		io.to(taskExecution.accountId).emit("task-execution:new", taskExecution)
	})
}
