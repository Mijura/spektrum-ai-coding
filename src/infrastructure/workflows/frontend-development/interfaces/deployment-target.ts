export interface DeploymentTargetPort {
    uploadFile(fileName: string, stream: NodeJS.ReadableStream, destinationFolder: string): Promise<void>
  }