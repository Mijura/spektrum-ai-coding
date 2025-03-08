import { z } from "zod";

const UserMessageSchema = z.object({
    projectId: z.string().uuid().describe("The project id"),
    message: z.string().describe("Last user message from the chat"),
})

export { UserMessageSchema }
