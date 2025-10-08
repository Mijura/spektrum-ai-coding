import { z } from "zod"

export interface Agent {
    readonly name: string
    readonly model: string
    readonly thoughtShape: z.ZodSchema

    preThought(input: any): Promise<void>
    loadContext(): string
    execute(task: any): Promise<any>
    afterThought(thought: z.infer<this['thoughtShape']>): Promise<any>
}
