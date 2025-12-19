import { AI_CODING_ENDPOINT } from "./config"

export class AICodingClient {

    private readonly endpoint: string

    constructor(){
        this.endpoint = AI_CODING_ENDPOINT
    }

    async initializeReactModule(projectId: string){
        try {
			const response = await fetch(`${this.endpoint}/initialize-react-module`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({
                    projectId: projectId
                })
			})

			if (!response.ok) {
				throw new Error(`Failed to initialize react module: ${response.statusText}`)
			}

			return await response.json() as string
		} catch (error) {
			console.error("Error initializing react module:", error)
			throw error
		}
    }
}