import express from "express"
import { router as projectRouter } from "@infrastructure/web/routes/project-routes"
import { corsMiddleware } from "@infrastructure/middlewares/cors-middleware"
import { serveProjectFilesMiddleware } from "@infrastructure/middlewares/serve-project-files-middleware"

const app = express()

// Middlewares
app.use(express.json())
app.use(corsMiddleware)
app.use("/:id", serveProjectFilesMiddleware)

// Routes
app.use("/api", projectRouter)

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000")
})
