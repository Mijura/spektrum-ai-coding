import { Project } from "@domain/entities/project"
import EventEmitter from "events"
import { Ticket } from "./ticket"


export abstract class Workflow extends EventEmitter {
	constructor() {
		super()
	}

	abstract run(project: Project, ticket: Ticket): Promise<Project>
	
}
