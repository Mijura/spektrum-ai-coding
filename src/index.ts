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

app.use("/:id", (req, res, next) => staticFileController.serveStaticFiles(req, res, next));
app.get("/:id", (req, res) => staticFileController.serveIndexHtml(req, res));

// Middleware to serve static files
app.use("/:id", (req: Request, res: Response, next: NextFunction) => {
    const projectPath = path.resolve(`projects/${req.params.id}/dist`)

    if (fs.existsSync(projectPath)) {
        express.static(projectPath)(req, res, next)
    } else {
        res.status(404).send("Project not found")
    }
})

// Serve index.html when accessing `/id`
app.get("/:id", (req: Request, res: Response) => {
    const projectPath = path.resolve(`projects/${req.params.id}/dist/index.html`)

    if (fs.existsSync(projectPath)) {
        res.sendFile(projectPath)
    } else {
        res.status(404).send("Project not found")
    }
})

app.use("/api", projectRouter)

app.listen(3000, () => {
	console.log("Server running on http://localhost:3000")
})
