import { EntryPoint } from "@app/types/entry-point"

export interface DeployToProductionUseCase {
	execute(projectId: string): Promise<EntryPoint>
}
