
import { ticketController } from "@infrastructure/dependencies/web"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/ticket", (req: Request, res: Response) => ticketController.createTicket(req, res))

router.get("/ticket/fetch-all/:projectId", (req: Request, res: Response) => ticketController.fetchAllTickets(req, res))


export { router as ticketRouter }