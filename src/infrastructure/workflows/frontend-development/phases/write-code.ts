import { frontendDevelopmentService, taskRepository, workflowRunRepository, projectRepository } from "@infrastructure/dependencies"
import { State } from "../main"
import { WorkflowPhase } from "@domain/workflow/workflow-phase"

export class WriteCode extends WorkflowPhase {
    name: string = "WriteCode"

    async execute(data: State): Promise<void> {
        console.log("Writing code")

        const { task, sourceCode, workflowRun } = data

        task.startedWork("DevOps Engineer", "WriteCode", "DevOps engineer is deploying the application for testing...")

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.updateSourceCode(task.projectId, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(task.projectId)
            buildSuccess = await frontendDevelopmentService.buildProject(task.projectId)
            await frontendDevelopmentService.deployToDevEnvironment(task.projectId)
            task.leaveComment("DevOps Engineer", "Application is successfully deployed and now is ready to be tested.")
            const project = await projectRepository.findById(task.projectId)
            project.setArtifact(sourceCode)
            await projectRepository.save(project)
            workflowRun.finishSuccessfully(sourceCode)
        } catch (error) {
            console.error("Error writing files:", error)
            task.leaveComment("DevOps Engineer", "I encountered an error during build : " + error)
            workflowRun.finishWithError(error as string, sourceCode)
            throw error
        } finally {
            task.finishedWork("DevOps Engineer", "WriteCode", "Finished deploying the application for testing")
            await taskRepository.save(task)
            await workflowRunRepository.save(workflowRun)
        }

    }
}