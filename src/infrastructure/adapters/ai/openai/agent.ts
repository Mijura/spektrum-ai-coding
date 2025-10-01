import OpenAI from "openai/index"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import { Agent } from "@domain/ports/ai/agent"

export enum Model {
    GPT_41 = "gpt-4.1",
    GPT_41_MINI = "gpt-4.1-mini",
    GPT_41_NANO = "gpt-4.1-nano",
    GPT_5 = "gpt-5",
    GPT_5_MINI = "gpt-5-mini",
    GPT_5_NANO = "gpt-5-nano"
}

export enum ReasoningEffort {
    MINIMAL = "minimal",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export abstract class OpenAIAgent implements Agent {

    /**
     * The name of the agent
     */
    abstract name: string

    /**
     * The AI model to use
     */
    abstract model: Model

    /**
     * The object definition we expect the AI to return
     */
    abstract thoughtShape: z.ZodSchema

    /**
     * The reasoning effort to use
     */
    abstract reasoningEffort: ReasoningEffort


    /**
     * The function to call before the AI has thought. It's useful to supplying data for the context since it's happens before the context is set.
     */
    async preThought(input: any): Promise<void> {
        return
    }

    /**
    * The function to call to set the context of the AI
    */
    abstract loadContext(): string

    /**
     * The function to call to trigger whole process
     * @param task T
     * @returns The response of the afterThought function
     */
    async execute(task: any): Promise<any> {
        await this.preThought(task)
    
        const client = new OpenAI()
    
    
        const completion = await client.chat.completions.parse({
            model: this.model,
            reasoning_effort: this.reasoningEffort,
            messages: [
                { role: "system", content: this.loadContext() },
                { role: "user", content: task.toString() }
            ],
            response_format: zodResponseFormat(this.thoughtShape, "thoughtShape")
        })
    
        const parsed = this.thoughtShape.parse(completion.choices[0].message.parsed)
    
        return await this.afterThought(parsed)
    }
    
    /**
     * Delegate task to another collaborator
     */
    protected async delegateTo(agentName: string, input: any): Promise<any> {

        // TODO: Implement this
        return null
    }

    /**
     * The function to call after the AI has thought
     */
    async afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any> {
        return tought
    }

    
}