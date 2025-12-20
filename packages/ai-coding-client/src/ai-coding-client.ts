import axios from 'axios'

export class AICodingClient {

    private readonly endpoint: string

    constructor(endpoint: string){
        this.endpoint = endpoint
    }

    async initializeReactModule(projectId: string): Promise<void>{
        try {
            
            const requestBody = {
                projectId: projectId
            }

            await axios.post(
				`${this.endpoint}/initialize-react-module`,
				requestBody
			)

		} catch (error) {
			console.error("Error initializing react module:", error)
			throw error
		}
    }
}