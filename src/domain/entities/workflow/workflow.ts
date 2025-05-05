import { Issue } from "../issue"


export abstract class Workflow {

	abstract run(issue: Issue): Promise<any>
	
}
