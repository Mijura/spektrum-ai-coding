
import { ticketController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.post("/ticket", (req: Request, res: Response) => ticketController.createTicket(req, res))

router.put("/ticket/title", (req: Request, res: Response) => ticketController.updateTicketTitle(req, res))

router.put("/ticket/description", (req: Request, res: Response) => ticketController.updateTicketDescription(req, res))

router.get("/ticket/fetch-all/:projectId", (req: Request, res: Response) => ticketController.fetchTickets(req, res))


export { router as ticketRouter }