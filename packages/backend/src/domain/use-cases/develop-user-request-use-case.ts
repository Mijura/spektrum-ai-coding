import { ProjectDetails } from "@domain/model/project-details"

export interface DevelopUserRequestUseCase {
	removeAllListeners(arg0: string): unknown
	on(event: "update", listener: (data: any) => void): unknown
	on(event: "done", listener: (data: any) => void): unknown
	execute(projectId: string, message: string): Promise<ProjectDetails>
}
