import { Module } from "@domain/value-objects/module"

export class Codebase {

    constructor(
        private readonly projectId: string,
        private readonly modules: Module []){
    }

    addModule(module: Module){
        this.modules.push(module)
    }

    static create(projectId: string){
        return new Codebase(projectId, [])
    }

}