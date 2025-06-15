import { WorkflowPhase } from "@honeycomb-app/hexacore";
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { PromptTemplate } from "@langchain/core/prompts"
import { gpt41, gpt41Mini, gpt41Nano, reactDeveloperModel } from "@infrastructure/workflows/models"
import { z } from "zod"
import { TaskMapper } from "@infrastructure/mappers/task-mapper";

const KeyboardDetailsSchema = z.object({
    keyboards: z.array(
        z.object({
            name: z.string().describe("Full keyboard name"),
            description: z.string().describe("Keyboard description"),
            url: z.string().describe("Data url"),
            price: z.number().describe("Keyboard price"),
            image: z.string().describe("Keyboard image url"),
        })
    )
})

export class ExtractKeyboards extends WorkflowPhase {

    name: string = "Vendor Extraction"
    
    async execute(input: any) {
        console.log("Scraping and analyzing")

        const { task } = input


        const data = await fetch("https://logickeyboard.com/shop/assistive-1038s1.html");
        const html = await data.text();


        const parser = StructuredOutputParser.fromZodSchema(KeyboardDetailsSchema)
    
        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(`
                
                ### Role:
                You are an financial analyst which extracts prices data about assestive keyboards.
                
                ### **Your Task:**
                1) Analyze data and find all assestive keyboards
                2) Extract details for each keyboard including name, description, url, price, image url

    
                ### **Data:**
                {data}

                ### **Format Instructions:**
                {outputSchema}
                `),
                gpt41Mini,
            parser,
        ])
    
        console.log(html)
        console.log('--------------------------------')
        const response = await chain.invoke({
            data: html,
            outputSchema: parser.getFormatInstructions(),
        })

        console.log(response)

        return response

    }
}