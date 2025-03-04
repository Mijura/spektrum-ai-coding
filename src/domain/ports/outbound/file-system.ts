export interface FileSystem {
    copyFile(source: string, destination: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
}