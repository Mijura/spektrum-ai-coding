import { v4 as uuidv4 } from 'uuid'

export class Version {

    private constructor(
        public readonly projectId: string,
        public readonly buildArtifactUrl: string,
        public readonly sourceCodeUrl: string,
        public readonly tag: string = uuidv4(),
        public readonly createdAt: string = new Date().toISOString()
    ) {}

    static create(projectId: string, buildArtifactUrl: string, sourceCodeUrl: string): Version {
        return new Version(projectId, buildArtifactUrl, sourceCodeUrl)
    }

    static rehydrate(data: {tag: string, projectId: string, buildArtifactUrl: string, sourceCodeUrl: string, createdAt: string}): Version {
        return new Version(data.projectId, data.buildArtifactUrl, data.sourceCodeUrl, data.tag, data.createdAt)
    }
}