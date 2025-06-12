import { frontendDevelopmentService, taskRepository, workflowRunRepository, projectRepository } from "@infrastructure/dependencies"
import { State } from "../runner"
import { WorkflowPhase } from "@honeycomb-app/hexacore"

export class UpdateCode extends WorkflowPhase {
    name: string = "UpdateCode"

    async execute(data: State): Promise<void> {
        console.log("Writing code")

        const { task, sourceCode, workflowRun, project } = data

        task.startedWork("DevOps Engineer", "UpdateCode", "DevOps engineer is updating the application...")

        let buildSuccess = false
        let installSuccess = false
        try {

            await frontendDevelopmentService.restoreProject(project)
            const wholeCode = await frontendDevelopmentService.updateSourceCode(task.projectId, sourceCode)
            installSuccess = await frontendDevelopmentService.installDependencies(task.projectId)
            buildSuccess = await frontendDevelopmentService.buildProject(task.projectId)
            await frontendDevelopmentService.deployToDevEnvironment(task.projectId)
            await frontendDevelopmentService.removeSourceCodeFromFileSystem(task.projectId)
            task.leaveComment("DevOps Engineer", "Application is successfully deployed and now is ready to be tested.")
            project.setArtifact(wholeCode)
            await projectRepository.save(project)
            workflowRun.finishSuccessfully(sourceCode)
        } catch (error) {
            console.error("Error writing files:", error)
            task.leaveComment("DevOps Engineer", "I encountered an error during build : " + error)
            workflowRun.finishWithError(error as string, sourceCode)
            throw error
        } finally {
            task.finishedWork("DevOps Engineer", "UpdateCode", "Finished updating the application")
            await taskRepository.save(task)
            await workflowRunRepository.save(workflowRun)
        }

    }
}