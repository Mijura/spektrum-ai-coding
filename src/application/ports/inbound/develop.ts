import { Message } from "@jigjoy-io/mosaic"

export interface Develop {
	execute(task: string, chatHistory: Message[], repositoryId: string): Promise<void>
}
