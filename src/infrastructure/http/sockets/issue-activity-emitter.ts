// infrastructure/http/sockets/initializeIssueActivityEmitter.ts
import { Server as HTTPServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import { eventBus } from "@domain/services/event-bus"

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

		socket.on("subscribe", ( issueId ) => {

            console.log(`Client: ${socket.id} subscribed for listening to issue: ${issueId} activity updates`)

			const sendUpdate = (data: any) => {
				console.log(`Emitting update:`, data)
				socket.emit("issue:update", data)
			}

			eventBus.on("issue:update", sendUpdate)

			socket.on("disconnect", () => {
				eventBus.off("issue:update", sendUpdate)
				console.log(`Client disconnected: ${socket.id}`)
			})
		})

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`)
		})
	})
}
