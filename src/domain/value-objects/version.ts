import { v4 as uuidv4 } from 'uuid'

export class Version {
    private constructor(
        public readonly projectId: string,
        public readonly buildArtifactUrl: string | null, //TODO: remove null option
        public readonly sourceCodeUrl: string | null, //TODO: remove null option
        public readonly tag: string = uuidv4(),
        public readonly createdAt: Date = new Date()
    ) {}

    static create(projectId: string): Version {
        return new Version(projectId, null, null) // TODO: Update constructor to pass urls instead of null
    }
}