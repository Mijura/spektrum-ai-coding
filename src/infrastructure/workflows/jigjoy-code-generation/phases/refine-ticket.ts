import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { WorkflowPhase } from "../context"
import { ProductOwnerSchema } from "@application/schemas/project.schema"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { productOwnerModel } from "@infrastructure/workflows/models"

export class RefineTicket extends WorkflowPhase {
    name: string = "RefineTicket"

    async execute(input: any): Promise<void> {

        console.log("Refining ticket")
        const { ticket, project } = input
        
        const parser = StructuredOutputParser.fromZodSchema(ProductOwnerSchema)
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an product owner expert on React project with Tailwind CSS and Framer Motion.
                
                ### **Your Task:**
                1) Your task is to transform refine ticket into appropriate title and description for developers.
                - Create a concise and minimal description. If the request is too broad try to minimize the request. 
                - Each task should be cohesive and should be enough to display functionality to user.
                - For example if the user demand note taking app, try to figure out what is the essence for this request. 
                    ** In this case you should create ticket with title "Enable user to add notes and display it after adding" and description "Implement note adding and displaying functioanlity" **
                    ** You pick this set of features because note adding do not have sense without displaying it and it represents core functionality of note taking app **
                - You should not suggest any additional improvements nor too broad features
                    ** like "Improve UI/UX" or "Improve performance" nor "Add tests" nor "Add documentation" nor any technical features **
                    ** also you should not suggest any additional features which represents new units of work **
    
                2) If Project Details do not have appropriate name and/or description, you should populate them with appropriate values.
                    ** Example of Invalid project name: "My Project" ** and ** Valid project name: "Note Taking App" **
                    ** Example of Invalid project description: "Empty project..." ** and ** Valid project description: "App for taking notes. It allows user to add, edit and delete notes..." **
    
                ### **Project Details**
                - **Project Details:** {project}
                - **Ticket Details:** {ticket}
    
                You must return JSON as response. Here is example of valid response:
                {{
                    "ticket": {{title: 'Enable user to add notes and display it after adding', description: 'Implement note adding and displaying functioanlity. Do not add any additional features nor any improvements.'}},
                    "projectDetails": {{
                        id: 'u5849j-435-345-345',
                        ownerId: '435-345-345-345',
                        created: '2021-01-01',
                        updated: '2021-01-01',
                        deploymentId: null,
                        status: 'Active',
                        name: 'Note Taking App',
                        description: 'App for taking notes',
                    }},
                    "message" : "I have updated ticket deatils and created tasks for note adding and displaying."
                }}
                `),
                productOwnerModel,
            parser,
        ])
    
        const response = await chain.invoke({
            ticket,
            project,
            outputSchema: parser.getFormatInstructions(),
        })

        const data = {
            ...input,
            ticket: {
                ...ticket,
                ...response.ticket
            },
            project: {
                ...project,
                ...response.projectDetails,
            },
            message: response.message
        }

        console.log("Transitioning to GenerateCode")
        this.transitionTo(data, "GenerateCode")
    }
}