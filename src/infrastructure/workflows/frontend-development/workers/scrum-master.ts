import { Task } from "@domain/entities/task"
import { Brain, Contributor } from "@honeycomb-app/hexacore"
import z from "zod"

export class ScrumMaster extends Contributor {

    name: string = "Scrum Master"

    brain = Brain.GPT_41_NANO

    thoughtShape = z.object({
        status: z.enum(["Feature", "Bug", "Improvement"])
    })

    task!: Task

    async preThought(task: Task): Promise<void> {
        this.task = task
    }

    loadContext(): string {
        return `
        You are a scrum master. Your task is to figure out the task status based on the last activity.

        ### ** Your Tasks:**

        1. **Review the task description and activities** to figure out last activite.
        2. **Based on the last activity** output the type of the activity (Feature, Bug, or Improvement).

        ### **Task**
        ${this.task}


        `
    }

    async afterThought(thought: z.infer<typeof this.thoughtShape>): Promise<void> {
        const { status } = thought
        
        switch (status) {
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