import dotenv from "dotenv"
// Load environment variables from .env file
dotenv.config()


import { projectRouter } from "@infrastructure/http/routes/project-routes"
import { taskRouter } from "@infrastructure/http/routes/task-routes"
import { corsMiddleware } from "@infrastructure/http/middleware/allow-requests"
import { serveProjectFilesMiddleware } from "@infrastructure/http/middleware/serve-project-files"
import { workflowRouter } from "./routes/workflow-routes"
import { initializeActivityEmitter } from "./sockets/activity-emitter"
import express from "express"
import http from "http"


const app = express()

// Middlewares
app.use(corsMiddleware)
app.use(express.json())
// Routes
app.use("/", projectRouter)
app.use("/", taskRouter)
app.use("/", workflowRouter)
app.use("/:id", serveProjectFilesMiddleware)


const server = http.createServer(app)

initializeActivityEmitter(server)

const port = process.env.PORT || 80
server.listen(port, () => {
	console.log(`Server running on port: ${port}`)
})
