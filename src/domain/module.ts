import { v4 as uuidv4 } from 'uuid' 

export enum ModuleType {
    FRONTEND = "FRONTEND",
} 

export class Module {

    private constructor(
        readonly id: string,
        readonly repositoryId: string,
        readonly type: ModuleType){
    }

    static create(repositoryId: string, moduleType: ModuleType){
        const id = uuidv4()
        return new Module(id, repositoryId, moduleType) 
    }

    static rehydrate(data: {
		id: string,
		repositoryId: string,
        type: ModuleType
	}): Module {
		return new Module(data.id, data.repositoryId, data.type)
	}

}