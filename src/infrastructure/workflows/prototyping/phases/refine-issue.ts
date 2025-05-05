import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41Nano } from "@infrastructure/workflows/models"
import { z } from "zod"
import { issueRepository } from "@infrastructure/dependencies"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { State, WorkflowPhase } from "../workflow-phase"

const ProductOwnerSchema = z.object({
	issue: z.object({
		title: z.string().describe("Short and concise title of the issue."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
	comment: z.string().describe("Concrete Comment to user about what you plan to do or what you did."),
    detailsUpdated: z.boolean().describe("The flag which indicates if the issue title and description should be updated.")
})

export class RefineIssue extends WorkflowPhase {
    name: string = "RefineIssue"

    async execute(data: State): Promise<void> {

        console.log("Refining issue")
        const { issue, project, sourceCode } = data

        issue.startedWork("Product Owner", "RefineIssue", "Product owner is analyzing the issue and prior activities")

        
        const parser = StructuredOutputParser.fromZodSchema(ProductOwnerSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Analyze issue title, issue description, activities, and comments." Figure out what user wants to be implemented.
                    ** Focus on the user latest request and do not suggest any additional features!
                    ** Latest user request is the last comment from user (it also goes with the user email)
                    ** If there is no comment than focus on the issue title and description.
                2) Create a comment that reflects latest user request.
                4) You should not suggest any additional improvements nor too broad features
                    ** Like "Improve UI/UX" or "Improve performance" nor "Add tests" nor "Add documentation" nor any technical features.**
    
                ### **Project Details**
                - **Project Details:** {project}
                - **Issue Details:** {issue}
    
                You must return JSON as response. Here is example of valid response:
                {{
                    "issue": {{title: 'Enable user to add notes and display it after adding', description: 'Implement note adding and displaying functioanlity.'}},
                    "comment" : "We should implement note adding and displaying functionality.",
                    "detailsUpdated": true
                }}
                `),
                gpt41Nano,
            parser,
        ])
    
        const response = await chain.invoke({
            issue: IssueMapper.toRecord(issue),
            project: ProjectMapper.toRecord(project),
            outputSchema: parser.getFormatInstructions(),
        })

        issue.finishedWork("Product Owner", "RefineIssue", "Finished figuring out what should be done")
   
        if (response.detailsUpdated) {
            issue.updateTitle("Product Owner", response.issue.title)
            issue.updateDescription("Product Owner", response.issue.description)
        }
        issue.leaveComment("Product Owner", response.comment)

        await issueRepository.save(issue)

        const newState: State = {
            issue: issue,
            project: project,
            sourceCode: sourceCode
        }

        console.log("Transitioning to GenerateCode")

        this.transitionTo("GenerateCode", newState)
    }
}