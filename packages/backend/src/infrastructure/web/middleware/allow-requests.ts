import { Request, Response, NextFunction } from "express"

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// Check if the request is for SSE by inspecting the URL or headers
	if (req.headers.accept && req.headers.accept.includes("text/event-stream")) {
		console.log("uuuuuuuuuuuuuuuuu")
		// **For SSE requests**, we handle headers differently
		res.header("Access-Control-Allow-Origin", "*")
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		res.header("Access-Control-Expose-Headers", "Content-Length, X-Accel-Buffering") // Needed for SSE
		res.header("X-Accel-Buffering", "no") // Prevents buffering of the response
		res.setHeader("Content-Type", "text/event-stream")
		res.setHeader("Cache-Control", "no-cache")
		res.setHeader("Connection", "keep-alive")
		res.flushHeaders() // Ensure headers are sent immediately

		// **Continue to the next middleware or route handler**
		return next()
	}else{

        res.header("Access-Control-Allow-Origin", "*") // Allow requests from any origin
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS") // Include OPTIONS
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization") // Allow these headers
    
        // Handle preflight requests
        if (req.method === "OPTIONS") {
            res.sendStatus(204) // No content for preflight requests
            return
        }
    
        next()
    }


}
