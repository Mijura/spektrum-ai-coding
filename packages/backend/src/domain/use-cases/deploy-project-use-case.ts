export interface DeployProjectUseCase {
    execute(projectId: string): Promise<void>
}
