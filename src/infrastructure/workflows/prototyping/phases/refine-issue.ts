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

        issue.startedWork("Product Owner", "RefineIssue", "Analyzing the issue and prior activities")

        
        const parser = StructuredOutputParser.fromZodSchema(ProductOwnerSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Your task is to create a comment what should be done to implement the issue.
                2) You should not suggest any additional improvements nor too broad features
                    ** like "Improve UI/UX" or "Improve performance" nor "Add tests" nor "Add documentation" nor any technical features **
                    ** also you should not suggest any additional features which represents new units of work 
                    **
                3) The comment should include feature which should be self-sustaining and should be enough to display functionality to user.
                    ** For example if the user demand note taking app, you should suggest note adding and displaying of added notes because note adding do not have sense without displaying it.
                    ** You should not suggest to add any additional features like authentication or user management...**
                4) Important: To analize what should be done you should analyze the issue details and issue activities!
                    ** If the issue do not have prior activities, you should refine ticket title and description to be more specific and to the point. And add comment what should be done.
                    ** If the ticket title and description should be updated, you should set deatilsUpdated to true, otherwise set it to false.
                    **
                4) Important: Pay attention on details what user wants to implement.
    
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