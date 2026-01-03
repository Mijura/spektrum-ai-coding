import { Task } from '@jigjoy-io/task-contracts'
import axios from 'axios'


export enum ModuleType {
    FRONTEND = "FRONTEND",
}

export type Module = {
    id: string,
    repositoryId: string,
    type: ModuleType
}

export class AICodingClient {

    private readonly endpoint: string

    constructor(endpoint: string){
        this.endpoint = endpoint
    }

    async initializeReactModule(projectId: string): Promise<Module>{
        try {
            
            const requestBody = {
                projectId: projectId
            }

            const response = await axios.post(
				`${this.endpoint}/initialize-react-module`,
				requestBody
			)

            return response.data

		} catch (error) {
			console.error("Error initializing react module:", error)
			throw error
		}
    }

    async develop(task: Task): Promise<void>{
        try {

            const response = await axios.post(
                `${this.endpoint}/develop`,
                task
            )

            return response.data
        }
        catch (error) {
            console.error("Error developing:", error)
            throw error
        }
    }   


}