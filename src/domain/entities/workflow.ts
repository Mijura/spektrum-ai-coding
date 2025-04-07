import { Project } from "@domain/entities/project"
import EventEmitter from "events"


export abstract class Workflow extends EventEmitter {
	constructor() {
		super()
	}

	abstract run(project: Project, message: string): Promise<Project>
	
}
