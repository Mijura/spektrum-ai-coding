import { Request, Response, NextFunction } from "express"

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
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