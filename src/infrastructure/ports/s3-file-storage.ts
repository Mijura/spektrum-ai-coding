import { Upload } from '@aws-sdk/lib-storage'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { Readable } from 'stream'
import { FileStorage } from '../../domain/ports/file-storage'

export class S3FileStorage implements FileStorage {
    s3: S3Client
    
    constructor() {
        this.s3 = new S3Client()
    }

    getContentType(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase()
        switch (ext) {
          case 'html':
            return 'text/html'
          case 'css':
            return 'text/css'
          case 'js':
            return 'application/javascript'
          case 'json':
            return 'application/json'
          case 'png':
            return 'image/png'
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg'
          case 'svg':
            return 'image/svg+xml'
          case 'ico':
            return 'image/x-icon'
          case 'txt':
            return 'text/plain'
          case 'woff':
            return 'font/woff'
          case 'woff2':
            return 'font/woff2'
          case 'tar.gz':
            return 'application/x-compressed-tar'
          default:
            return 'application/octet-stream'
        }
      }

    async uploadFile(fileName: string, stream: Readable, folderName: string): Promise<void> {
        const bucket = process.env.DEPLOYMENT_BUCKET
        if (!bucket) throw new Error('Missing DEPLOYMENT_BUCKET env variable')

        const key = `${folderName}/${fileName}`.replace(/\\/g, '/')

        const upload = new Upload({
            client: this.s3,
            params: {
                Bucket: bucket,
                Key: key,
                Body: stream, // ✅ Node.js Readable stream
                ContentType: this.getContentType(fileName)
            },
        })

        await upload.done();
        console.log(`✅ Uploaded: ${key}`)
    }

    streamToBuffer(stream: Readable): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on('data', (chunk) => chunks.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(chunks)))
        stream.on('error', reject)
      })
    }

    async downloadFile(key: string): Promise<Buffer> {
      const bucket = process.env.DEPLOYMENT_BUCKET
      if (!bucket) throw new Error('Missing DEPLOYMENT_BUCKET env variable')
  
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
  
      const response = await this.s3.send(command)
  
      if (!response.Body || !(response.Body instanceof Readable)) {
        throw new Error('S3 returned an invalid or empty response body')
      }
  
      return await streamToBuffer(response.Body)
    }
  
    async removeFile(key: string): Promise<void> {
      const bucket = process.env.DEPLOYMENT_BUCKET
      if (!bucket) throw new Error('Missing DEPLOYMENT_BUCKET env variable')
  
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
  
      await this.s3.send(command)
      console.log(`🗑️ Deleted: ${key}`)
    }
}
