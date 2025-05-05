import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41Nano } from "@infrastructure/workflows/models"
import { z } from "zod"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
import { WorkflowPhase } from "../../../../domain/entities/workflow/workflow-phase"
import { Input, ProjectDetails } from "../main"


const ProjectDetailsSchema = z.object({
	project: z.object({
		title: z.string().describe("Short and concise title of the issue."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
})

export class RefineProjectDetails extends WorkflowPhase {
    name: string = "RefineProjectDetails"

    async execute(data: Input): Promise<ProjectDetails> {

        console.log("Refining project details")
        const { issue } = data

        const parser = StructuredOutputParser.fromZodSchema(ProjectDetailsSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Analyze issue title, issue description provided by user.
                2) Based on the issue details, refine project details.
    
                ### **Issue Details:** {issue}
    
                You must return JSON as response. 

                Here is example of valid response:
                {{
                    "project": 
                        {{
                            title: 'Note-Taking App', 
                            description: 'A notetaking app with a focus on simplicity and ease of use.'
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

        return response.project


    }
}