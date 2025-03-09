import express from "express"
import { router as projectRouter } from "@infrastructure/web/routes/project-routes"
import { corsMiddleware } from "@infrastructure/web/middleware/allow-requests"
import { serveProjectFilesMiddleware } from "@infrastructure/web/middleware/serve-project-files"


import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(corsMiddleware)
app.use("/:id", serveProjectFilesMiddleware)

// Routes
app.use("/", projectRouter)

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000")
})
