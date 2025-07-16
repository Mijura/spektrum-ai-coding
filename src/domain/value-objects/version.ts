import { v4 as uuidv4 } from 'uuid'

export class Version {
    private constructor(
        public readonly projectId: string,
        public readonly tag: string = uuidv4(),
        public readonly createdAt: Date = new Date()
    ) {}

    static create(projectId: string): Version {
        return new Version(projectId)
    }
}