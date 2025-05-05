import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { reactDeveloperModel } from "@infrastructure/workflows/models"
import { WorkflowPhase } from "../../../../domain/entities/workflow/workflow-phase"
import { IssueMapper } from "@infrastructure/mappers/issue-mapper"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { issueRepository } from "@infrastructure/dependencies"
import { State } from "../main"
import { z } from "zod"

const SourceCodeSchema = z.record(
	z.string().describe("The file path as a string"),
	z.string().describe("The source code (content) inside a file")
)

const DeveloperOutputSchema = z.object({
	sourceCode: SourceCodeSchema,
	comment: z.string().describe("The comment to be added to the issue. It's a short summary of the changes you made from the user's perspective")
})
export class GenerateCode extends WorkflowPhase {
    name: string = "GenerateCode"

    async execute(data: State): Promise<void> {
        console.log("Generating code")
        
        const { issue, sourceCode } = data

        issue.startedWork("React Developer", "GenerateCode", "Developer is developing the feature...")

        const parser = StructuredOutputParser.fromZodSchema(DeveloperOutputSchema)
	
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                ### Role:
                You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
                ### **Your Task:**
                1. ** Analyze issue details, activities, and comments." Figure out what should be done to resolve the issue.
                    ** You can recognize your prior activities by author name 'React Developer' **
                
                ****Analyze the current source code** to determine if the required functionality already exists.
                - If the functionality exists, modify it as needed.
                - If the functionality does not exist, create new code to implement it.
                
                2. **Modify or create source files as needed**:
                - Create new components, hooks, or utilities as required.
    
                3. **If you are using a new dependency, you should add it to the package.json file.**:
                - For example, if you are using react-hook-form, you should add it to the package.json file.
                - NOTE: If you don't add the dependency to the package.json file, the project will not work.
    
    
                ### **Details**
                - **Issue Details:** {issue}
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
            issue: IssueMapper.toRecord(issue),
            sourceCode: sourceCode,
            outputSchema: parser.getFormatInstructions(),
        })
    
        issue.finishedWork("React Developer", "GenerateCode", "Finished with coding")
        issue.leaveComment("React Developer", output.comment)
        await issueRepository.save(issue)

        const updatedState: State = {
            issue: issue,
            sourceCode: output.sourceCode
        }

        console.log("Transitioning to WriteCode")

        this.transitionTo("WriteCode", updatedState)


    }
}