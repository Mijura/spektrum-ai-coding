import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";

export const o1Mini = new ChatOpenAI({
    modelName: "o1-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

export const o3Mini = new ChatOpenAI({
    modelName: "o3-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

export const claude37Sonnet = new ChatAnthropic({
    modelName: "claude-3-7-sonnet-20250219",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
})

export const claude35Sonnet = new ChatAnthropic({
    modelName: "claude-3-5-sonnet-20241022",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
})