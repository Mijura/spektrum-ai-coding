import { initializeReactProject } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class ModuleController {

    async initializeReactProject(req: Request, res: Response): Promise<void> {
        
        const projectId = req.body.projectId

        if(!projectId){
            throw new Error(`Project id is required`)
        }

		try {
            await initializeReactProject.execute(projectId)
            res.status(200).json({ message: "React project initialized" })
		} catch (error) {
			console.error("Error during react project initialization:", error)
            res.status(500).json({ error: "Internal server error" })
		}

    }
    
}