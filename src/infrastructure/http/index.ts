import dotenv from "dotenv"
// Load environment variables from .env file
dotenv.config()


import { corsMiddleware } from "@infrastructure/http/middleware/allow-requests"
import { aiCodingRoutes } from "./routes/ai-coding-routes"
import { initializeActivityEmitter } from "./sockets/activity-emitter"
import express from "express"
import http from "http"


const app = express()

// Middlewares
app.use(corsMiddleware)
app.use(express.json())

// Routes
app.use("/", aiCodingRoutes)


const server = http.createServer(app)

initializeActivityEmitter(server)

const port = process.env.PORT || 80
server.listen(port, () => {
	console.log(`Server running on port: ${port}`)
})
