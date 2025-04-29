import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41Nano } from "@infrastructure/workflows/models"
import { z } from "zod"
import { issueRepository } from "@infrastructure/dependencies"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { State, WorkflowPhase } from "../workflow-phase"
import { Comment } from "@domain/entities/comment"

const ProductOwnerSchema = z.object({
	issue: z.object({
		title: z.string().describe("Short and concise title of the issue."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
	comment: z.string().describe("Concrete Comment to user about what you plan to do or what you did.")
})

export class RefineIssue extends WorkflowPhase {
    name: string = "RefineIssue"

    async execute(data: State): Promise<void> {

        console.log("Refining issue")
        const { issue, project, sourceCode } = data

        
        const parser = StructuredOutputParser.fromZodSchema(ProductOwnerSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Your task is to transform refine issue into appropriate title and description for developers.
                - Create a concise and minimal description. If the request is too broad try to minimize the request. 
                - Each task should be cohesive and should be enough to display functionality to user.
                - For example if the user demand note taking app, try to figure out what is the essence for this request. 
                    ** In this case you should create issue with title "Enable user to add notes and display it after adding" and description "Implement note adding and displaying functioanlity" **
                    ** You pick this set of features because note adding do not have sense without displaying it and it represents core functionality of note taking app **
                - You should not suggest any additional improvements nor too broad features
                    ** like "Improve UI/UX" or "Improve performance" nor "Add tests" nor "Add documentation" nor any technical features **
                    ** also you should not suggest any additional features which represents new units of work **
    
                ### **Project Details**
                - **Project Details:** {project}
                - **Issue Details:** {issue}
    
                You must return JSON as response. Here is example of valid response:
                {{
                    "issue": {{title: 'Enable user to add notes and display it after adding', description: 'Implement note adding and displaying functioanlity. Do not add any additional features nor any improvements.'}},
                    "comment" : "I have updated issue deatils and created tasks for note adding and displaying."
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
    
        issue.updateTitle("Product Owner", response.issue.title)
        issue.updateDescription("Product Owner", response.issue.description)
        const comment = Comment.create("Product Owner", response.comment)
        issue.leaveComment(comment)

        await issueRepository.save(issue)

        const newState: State = {
            issue: issue,
            project: project,
            sourceCode: sourceCode
        }

        console.log("Transitioning to GenerateCode")
        const update = { 
            node: "Product Owner", 
            issue: IssueMapper.toRecord(issue) 
        }

        this.emit("update", update)
        this.transitionTo("GenerateCode", newState)
    }
}