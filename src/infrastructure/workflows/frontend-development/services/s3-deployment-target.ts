import { Upload } from '@aws-sdk/lib-storage'
import { S3Client } from '@aws-sdk/client-s3'
import type { Readable } from 'stream'
import { DeploymentTargetPort } from '../interfaces/deployment-target'

export class S3DeploymentTargetAdapter implements DeploymentTargetPort {
    s3: S3Client
    prefix: string
    
    constructor() {
        this.s3 = new S3Client()
        this.prefix = "projects"
    }

    async uploadFile(relativePath: string, stream: Readable): Promise<void> {
        const bucket = process.env.DEPLOYMENT_BUCKET;
        if (!bucket) throw new Error('Missing DEPLOYMENT_BUCKET env variable')

        const key = `${this.prefix}/${relativePath}`.replace(/\\/g, '/')

        const upload = new Upload({
            client: this.s3,
            params: {
                Bucket: bucket,
                Key: key,
                Body: stream, // ✅ Node.js Readable stream
            },
        })

        await upload.done();
        console.log(`✅ Uploaded: ${key}`)
    }
}
