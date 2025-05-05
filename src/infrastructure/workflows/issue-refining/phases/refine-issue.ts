import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41Nano } from "@infrastructure/workflows/models"
import { z } from "zod"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
import { WorkflowPhase } from "../../../../domain/entities/workflow/workflow-phase"
import { State } from "../../prototyping/main"
import { Issue } from "@domain/entities/issue"

const ProductOwnerSchema = z.object({
	issue: z.object({
		title: z.string().describe("Short and concise title of the issue."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
})

export class RefineIssue extends WorkflowPhase {
    name: string = "RefineIssue"

    async execute(data: State): Promise<Issue> {

        console.log("Refining issue")
        const { issue } = data

        issue.startedWork("Product Owner", "RefineIssue", "Product owner is analyzing the issue and prior activities")

        
        const parser = StructuredOutputParser.fromZodSchema(ProductOwnerSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Analyze issue title, issue description provided by user.
                2) Refine issue title and description based on the user request.
    
                ### **Project Details**
                - **Issue Details:** {issue}
    
                You must return JSON as response. Here is example of valid response:
                {{
                    "issue": 
                        {{
                            title: 'Enable user to add notes and display it after adding', 
                            description: 'Implement note adding and displaying functioanlity.'
                        }}
                }}
                `),
                gpt41Nano,
            parser,
        ])
    
        const response = await chain.invoke({
            issue: IssueMapper.toRecord(issue),
            outputSchema: parser.getFormatInstructions(),
        })

        issue.finishedWork("Product Owner", "RefineIssue", "Finished figuring out what should be done")
   
        
        issue.updateTitle("Product Owner", response.issue.title)
        issue.updateDescription("Product Owner", response.issue.description)

        return issue


    }
}