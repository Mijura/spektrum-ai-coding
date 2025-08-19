
export interface CommentAndDevelop {
    execute(taskId: string, authorId: string, commentText: string): Promise<void>
} 