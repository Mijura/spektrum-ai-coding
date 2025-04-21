import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { WorkflowPhase } from "../context"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { DeveloperOutputSchema } from "@application/schemas/source-code.schema"
import { reactDeveloperModel } from "@infrastructure/workflows/models"
import { frontendDevelopmentService } from "@infrastructure/dependencies"

export class GenerateCode extends WorkflowPhase {
    name: string = "GenerateCode"

    async execute(input: any): Promise<void> {
        console.log("Generating code")
        
        const { project, message } = input

        const sourceCodeBefore = await frontendDevelopmentService.fetchSourceCode(project.id)

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

        const developerOutput = await chain.invoke({
            ticket: message,
            project: project,
            sourceCode: sourceCodeBefore,
            outputSchema: parser.getFormatInstructions(),
        })

        const data = {
            ...input,
            sourceCode: developerOutput.sourceCode,
            message: developerOutput.comment,
        }

        console.log("Transitioning to WriteCode")
        this.transitionTo(data, "WriteCode")
    }
}