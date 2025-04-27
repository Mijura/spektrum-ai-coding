import { Project } from "@domain/entities/project"
import EventEmitter from "events"
import { Issue } from "./issue"


export abstract class Workflow extends EventEmitter {
	constructor() {
		super()
	}

	abstract run(project: Project, issue: Issue): Promise<Project>
	
}
