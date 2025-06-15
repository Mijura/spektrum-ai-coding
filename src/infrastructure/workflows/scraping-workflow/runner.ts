import { Task } from "@domain/entities/task";
import { WorkflowRunner } from "@domain/ports/workflow-runner";
import { WorkflowPhaseRegistry, Workflow } from "@honeycomb-app/hexacore";
import { ExtractKeyboards } from "./phases/extract-keyboards";

export class KeyboardPriceSyncRunner implements WorkflowRunner {

    async run(task: Task): Promise<any> {

        WorkflowPhaseRegistry.register(ExtractKeyboards)

        const context = new Workflow(new ExtractKeyboards())

        const response = await context.execute({
            task
        })

        return response
    }
}