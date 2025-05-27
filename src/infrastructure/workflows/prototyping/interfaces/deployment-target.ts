export interface DeploymentTargetPort {
    uploadFile(relativePath: string, stream: NodeJS.ReadableStream, folderName: string): Promise<void>
  }