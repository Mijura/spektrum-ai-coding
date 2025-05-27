export interface DeploymentTargetPort {
    uploadFile(relativePath: string, stream: NodeJS.ReadableStream): Promise<void>
  }