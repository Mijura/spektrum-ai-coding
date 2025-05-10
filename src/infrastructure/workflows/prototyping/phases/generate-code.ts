import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { reactDeveloperModel } from "@infrastructure/workflows/models"
import { WorkflowPhase } from "../../../../domain/entities/workflow/workflow-phase"
import { TaskMapper } from "@infrastructure/mappers/task-mapper"
import { ProjectMapper } from "@infrastructure/mappers/project-mapper"
import { taskRepository } from "@infrastructure/dependencies"
import { State } from "../main"
import { z } from "zod"

const SourceCodeSchema = z.record(
	z.string().describe("The file path as a string"),
	z.string().describe("The source code (content) inside a file")
)

const DeveloperOutputSchema = z.object({
	sourceCode: SourceCodeSchema,
	comment: z.string().describe("The comment to be added to the task. It's a short summary of the changes you made from the user's perspective")
})
export class GenerateCode extends WorkflowPhase {
    name: string = "GenerateCode"

    async execute(data: State): Promise<void> {
        console.log("Generating code")
        
        const { task, sourceCode, workflowRun, accountId } = data

        task.startedWork("React Developer", "GenerateCode", "Developer is developing the feature...")

        const parser = StructuredOutputParser.fromZodSchema(DeveloperOutputSchema)
	
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                ### Role:
                You are an React Frontend Developer working on React project with Tailwind CSS and Framer Motion. 
    
                ### **Your Tasks:**
                1. ** Analyze task details, activities, and comments." Figure out what should be done to resolve the task.
                    ** You can recognize your prior activities by author name 'React Developer' **
                
                ****Analyze the current source code** to determine if the required functionality already exists.
                - If the functionality exists, modify it as needed.
                - If the functionality does not exist, create new components, hooks, or utilities as required.
                
                2. **Modify or create source files as needed**:
                - Create new components, hooks, or utilities as required.
    
                3. ** Create a reusable components in the src/components folder if needed**:
                - Create a reusable components in the separate files.
                - Use the components in the source code.

                4. **If you are using a new dependency, you should add it to the package.json file.**:
                - For example, if you are using react-hook-form, you should add it to the package.json file.
                - NOTE: If you don't add the dependency to the package.json file, the project will not work.
    
                ### **Details**
                - **Task Details:** {task}
                - **Current Source Code:** {sourceCode}
    
                Important:
                - Double check all imports or require statements to ensure they are listed in the package.json file.
                - Respond only in valid JSON. The JSON object you return should match the following schema:
    
                {{
                    "sourceCode": {{
                            "src/components/HelloWorld.tsx": "import {{ motion }} from 'framer-motion';\nimport {{ format }} from 'date-fns';\n\nexport default function HelloWorld() {{\n  const today = format(new Date(), 'eeee, MMMM do, yyyy');\n\n  return (\n    <motion.div \n      className=\"p-4 text-center text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-lg\"\n      initial={{ opacity: 0, y: -10 }} \n      animate={{ opacity: 1, y: 0 }} \n      transition={{ duration: 0.5 }}\n    >\n      Hello World! Today is {{today}}\n    </motion.div>\n  );\n}}",
                            "src/App.tsx": "import HelloWorld from './components/HelloWorld';\n\nexport default function App() {{\n  return (\n    <div className=\"min-h-screen flex items-center justify-center bg-gray-100\">\n      <HelloWorld />\n    </div>\n  );\n}}",
                            "src/main.tsx": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);",
                            "package.json": "{{\n  \"dependencies\": {{\n    \"framer-motion\": \"^10.11.1\",\n    \"date-fns\": \"^3.6.0\"\n  }}\n}}"
                        }},
                    "comment": "I created a HelloWorld component that uses Framer Motion for animation and date-fns to display today's date in a readable format."
                }}

    
                Format Instructions: {outputSchema}
    
    
                `),
                reactDeveloperModel,
            parser,
        ])
    
        const output = await chain.invoke({
            task: TaskMapper.toRecord(task),
            sourceCode: sourceCode,
            outputSchema: parser.getFormatInstructions(),
        })
    
        task.finishedWork("React Developer", "GenerateCode", "Finished with coding")
        task.leaveComment("React Developer", output.comment)
        await taskRepository.save(task)

        const updatedState: State = {
            task,
            sourceCode: output.sourceCode,
            workflowRun,
            accountId
        }

        console.log("Transitioning to WriteCode")

        this.transitionTo("WriteCode", updatedState)


    }
}