import { Project } from "@domain/entities/project"
import { Issue } from "./issue"


export abstract class Workflow {

	abstract run(project: Project, issue: Issue): Promise<Project>
	
}
