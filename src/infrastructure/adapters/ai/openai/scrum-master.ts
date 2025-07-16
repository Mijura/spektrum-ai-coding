import { Task } from "@domain/entities/task"
import { ActivityType, CommentLeftMetadata } from "@domain/value-objects/activity"
import { OpenAIContributor, Brain } from "./contributor"
import z from "zod"

export class ScrumMaster extends OpenAIContributor {

    name: string = "Scrum Master"

    brain = Brain.GPT_41_NANO

    thoughtShape = z.object({
        label: z.enum(["Feature", "Bug", "Improvement"]).describe("The label of the input")
    })

    task!: Task

    async preThought(task: Task): Promise<void> {
        this.task = task
    }

    loadContext(): string {

        let input = ''
        const lastActivity  = this.task.getActivityLog().at(-1)
        if (lastActivity?.type === ActivityType.COMMENT_LEFT) {
            const comment = lastActivity.metadata as CommentLeftMetadata
            return comment.commentText
        }else{
            input = JSON.stringify(this.task)
        }

        return `
        ## 🌟 Role

        You are a **Scrum Master AI Agent**.
        Your job is to 

        ---

        ## Your Responsibilities

        ### 1. Analyze the task input.
        ### 2. Classify the task:

        - Bug — If the input contains words like "error," "fail," "crash," "fix," "bug," "issue," "complain," "problem," or similar, classify as "Bug".
        - Improvement — If the input contains words like "improve," "refactor," "optimize," "enhance," or similar, classify as "Improvement".
        - Feature — If the input contains words like "add," "create," "implement," "build," "develop," "introduce," or similar, classify as "Feature".

        ---

        ## Input Task

        ${input}

        ---
        `
    }

    async afterThought(thought: z.infer<typeof this.thoughtShape>): Promise<void> {
        const { label } = thought
        
        console.log("Scrum Master", "Task Label", label)
        switch (label) {
            case "Feature":
                await this.delegateTo("Graphic Designer", this.task)
                break
            case "Bug":
                await this.delegateTo("React Developer", this.task)
                break
            case "Improvement":
                await this.delegateTo("React Developer", this.task)
                break
        }
    }
}