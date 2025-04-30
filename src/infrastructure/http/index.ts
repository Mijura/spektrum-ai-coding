import express from "express"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

import { projectRouter } from "@infrastructure/http/routes/project-routes"
import { issueRouter } from "@infrastructure/http/routes/issue-routes"
import { corsMiddleware } from "@infrastructure/http/middleware/allow-requests"
import { serveProjectFilesMiddleware } from "@infrastructure/http/middleware/serve-project-files"
import http from "http"
import { workflowRunRouter } from "./routes/workflow-run-routes"
import { initializeIssueActivityEmitter } from "./sockets/issue-activity-emitter"



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

initializeIssueActivityEmitter(server)

server.listen(3000, () => {
	console.log("Server running on http://localhost:3000")
})
