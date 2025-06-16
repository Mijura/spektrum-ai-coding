import OpenAI from "openai"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"


export enum Brain {
    GPT_41 = "gpt-4.1",
    GPT_41_MINI = "gpt-4.1-mini",
    GPT_41_NANO = "gpt-4.1-nano"
}

export abstract class AIWorker{

    /**
     * The AI model to use
     */
    abstract brain: Brain

    /**
     * The object definition we expect the AI to return
     */
    abstract thoughtShape: z.ZodSchema

    /**
     * The function to call before the AI has thought. It's useful to supplying data for the context since it's happens before the context is set.
     */
    abstract preThought(input: any): Promise<void>

    /**
    * The function to call to set the context of the AI
    */
    abstract loadContext(): string

    /**
     * The function to call after the AI has thought
     */
    abstract afterThought(tought: z.infer<typeof this.thoughtShape>): Promise<any>


    /**
     * The function to call to trigger whole process
     * @param task T
     * @returns The response of the afterThought function
     */
    async execute(task: any): Promise<any> {
        await this.preThought(task)

        const client = new OpenAI()


        const response = await client.chat.completions.create({
            model: this.brain,
            messages: [
                { role: "system", content: this.loadContext() },
                { role: "user", content: task.toString() }
            ]
        })

        const raw = response.choices[0].message.content || ""


        console.log(raw)

        const parsed = this.thoughtShape.parse()

        return await this.afterThought(JSON.parse(raw))
    }
    
    
}