import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";

const o1Mini = new ChatOpenAI({
    modelName: "o1-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

const o1 = new ChatOpenAI({
    modelName: "o1",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

const gpt4o = new ChatOpenAI({
    modelName: "gpt-4o",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

const gpt4oMini = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

const o3Mini = new ChatOpenAI({
    modelName: "o3-mini",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

const claude37Sonnet = new ChatAnthropic({
    modelName: "claude-3-7-sonnet-20250219",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    cache: true,
})

const claude35Sonnet = new ChatAnthropic({
    modelName: "claude-3-5-sonnet-20241022",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    cache: true,
})

export const productOwnerModel = o3Mini
export const graphicDesignerModel = o3Mini
export const uiuxDesignerModel = o3Mini
export const principalDeveloperModel = o3Mini
export const reactDeveloperModel = o3Mini