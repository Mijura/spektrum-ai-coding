import axios from 'axios'


export enum ModuleType {
    FRONTEND
}

export type Module = {
    id: string,
    repositoryId: string,
    moduleType: ModuleType
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
}