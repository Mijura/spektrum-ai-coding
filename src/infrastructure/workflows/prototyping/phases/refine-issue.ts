import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41Nano } from "@infrastructure/workflows/models"
import { z } from "zod"
import { projectRepository, issueRepository, activityRepository } from "@infrastructure/dependencies"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { State, WorkflowPhase } from "../workflow-phase"
import { WorkflowRun } from "@domain/entities/activities/workflow-run"

const ProjectDetailsSchema = z.object({
	name: z.string().describe("Short name of the project. Should be filled only if it's empty."),
	description: z.string().describe("Short description of the project purpose. Should be filled only if it's empty."),
	updated: z.boolean().optional().describe("Flag indicating if the project details were updated.")
})

const ProductOwnerSchema = z.object({
	projectDetails: ProjectDetailsSchema,
	issue: z.object({
		title: z.string().describe("Short and concise title of the issue."),
		description: z.string().describe("Concrete description what should be implemented, why it should be implemented and what shouldn't be implemented.")}),
	comment: z.string().describe("Concrete Comment to user about what you plan to do or what you did.")
})

export class RefineIssue extends WorkflowPhase {
    name: string = "RefineIssue"

    async execute(data: State): Promise<void> {

        console.log("Refining issue")
        const { issue, project, sourceCode, issueActivities } = data

        const activity = WorkflowRun.create("User", issue, "Prototyping", "Refining Issue")
        await activityRepository.save(activity)

        issueActivities.push(activity)

        this.emit("update", { 
            node: "Product Owner", 
            activity: activity
        })

        
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
    
                2) If Project Details do not have appropriate name and/or description, you should populate them with appropriate values.
                    ** Example of Invalid project name: "My Project" ** and ** Valid project name: "Note Taking App" **
                    ** Example of Invalid project description: "Empty project..." ** and ** Valid project description: "App for taking notes. It allows user to add, edit and delete notes..." **
    
                ### **Project Details**
                - **Project Details:** {project}
                - **Issue Details:** {issue}
    
                You must return JSON as response. Here is example of valid response:
                {{
                    "issue": {{title: 'Enable user to add notes and display it after adding', description: 'Implement note adding and displaying functioanlity. Do not add any additional features nor any improvements.'}},
                    "projectDetails": {{
                        name: 'Note Taking App',
                        description: 'App for taking notes',
                        updated: true
                    }},
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
    
        if (response.projectDetails.updated) {
            project.updateName(response.projectDetails.name)
            project.updateDescription(response.projectDetails.description)
            await projectRepository.save(project)
        }
        issue.updateTitle(response.issue.title)
        
        // TODO: Save activity

        issue.updateDescription(response.issue.description)
        // TODO: Save activity  

        issue.leaveComment("Product Owner", response.comment)
        // TODO: Save activity

        await issueRepository.save(issue)

        const newState: State = {
            issue: issue,
            project: project,
            sourceCode: sourceCode,
            issueActivities: issueActivities
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