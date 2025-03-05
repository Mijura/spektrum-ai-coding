import express, { Request, Response, NextFunction } from "express"
import { router as projectRouter } from "./infrastructure/web/routes/project-routes"

const PORT = 3000

const app = express()

// Middleware to parse JSON requests
app.use(express.json())

// CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*") // Allow requests from any origin
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS") // Include OPTIONS
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization") // Allow these headers

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.sendStatus(204) // No content for preflight requests
        return
    }

    next()
})
app.use("/api", projectRouter)

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000")
})
