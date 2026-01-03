import { Module } from "./module"

export class Codebase {

    constructor(
        readonly projectId: string,
        readonly modules: Module []){
    }

    addModule(module: Module){
        this.modules.push(module)
    }

    static create(projectId: string){
        return new Codebase(projectId, [])
    }

    static rehydrate(data: {
		projectId: string,
		modules: Module[]
	}): Codebase {
		return new Codebase(data.projectId, data.modules)
	}

}