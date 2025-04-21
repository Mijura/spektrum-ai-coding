import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { DeveloperOutputSchema } from "@application/schemas/source-code.schema"
import { reactDeveloperModel } from "@infrastructure/workflows/models"
import { State, WorkflowPhase } from "../workflow-phase"

export class GenerateCode extends WorkflowPhase {
    name: string = "GenerateCode"

    async execute(data: State): Promise<void> {
        console.log("Generating code")
        
        const { project, ticket, sourceCode } = data

        const parser = StructuredOutputParser.fromZodSchema(DeveloperOutputSchema)
        
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                ### Role:
                You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 

                ### **Your Task:**
                1. **Analyze the current source code** to determine if the required functionality already exists.
                - If the functionality exists, modify it as needed.
                - If the functionality does not exist, create new code to implement it.
                
                2. **Modify or create source files as needed**:
                - Create new components, hooks, or utilities as required.

                3. **Modify package.json when you plan to use external dependencies**:
                - If a new dependency is introduced, update package.json.


                ### **Project Details**
                - **Project Context:** {project}
                - **Ticket Details:** {ticket}
                - **Current Source Code:** {sourceCode}

                Important:
                - Double check all imports or require statements to ensure they are listed in the package.json file.
                - Respond only in valid JSON. The JSON object you return should match the following schema:

                {{
                    "sourceCode": {{
                        "src/App.tsx": 'export default function App() {{ return <div>Hello World</div>; }}'
                    }},
                    "comment": "I implemented Hello World to be sure the project is working."
                }}

                Format Instructions: {outputSchema}


                `),
                reactDeveloperModel,
            parser,
        ])

        const output = await chain.invoke({
            ticket: ticket,
            project: project,
            sourceCode: sourceCode,
            outputSchema: parser.getFormatInstructions(),
        })

        const updatedState: State = {
            project: project,
            ticket: ticket,
            sourceCode: output.sourceCode,
        }

        console.log("Transitioning to WriteCode")
        this.transitionTo("WriteCode", updatedState)
    }
}