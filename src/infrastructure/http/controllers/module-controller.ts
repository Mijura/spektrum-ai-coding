import { initializeReactModule } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class ModuleController {

    async initializeReactModule(req: Request, res: Response): Promise<void> {
        
        const projectId = req.body.projectId

        if(!projectId){
            throw new Error(`Project id is required`)
        }

		try {
            await initializeReactModule.execute(projectId)
            res.status(200).json({ message: "React project initialized" })
		} catch (error) {
			console.error("Error during react project initialization:", error)
            res.status(500).json({ error: "Internal server error" })
		}

    }
    
}