import { Module } from "@domain/value-objects/module"

export type CodebaseRecord = {
	projectId: string
	modules: Module[]
}

