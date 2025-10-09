export enum ModelFamily {
    OPENAI = 'OpenAI',
    ANTROPIC = 'Antropic'
}

export enum ModelId {
    GPT_41 = "gpt-4.1",
    GPT_41_MINI = "gpt-4.1-mini",
    GPT_41_NANO = "gpt-4.1-nano",
    GPT_5 = "gpt-5",
    GPT_5_MINI = "gpt-5-mini",
    GPT_5_NANO = "gpt-5-nano"
}

export enum ReasoningEffort {
    MINIMAL = "minimal",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}

export abstract class Model {
    abstract id: ModelId
    abstract family: ModelFamily
    abstract call(message:string, tools:[]): any
}