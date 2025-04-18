import { CommentDto } from "@application/dto/ticket"

export class Comment {
	public readonly id: string
	public readonly authorId: string
	public text: string
	public readonly createdAt: string
	public editedAt?: string

	constructor(
	  id: string,
	  authorId: string,
	  text: string,
	  createdAt: string,
	  editedAt?: string
	) {
		this.id = id
		this.authorId = authorId
		this.text = text
		this.createdAt = createdAt
		this.editedAt = editedAt
	}
  
	edit(newText: string) {
	  this.text = newText
	  this.editedAt = new Date().toISOString()
	}

	static create(id: string, authorId: string, text: string): Comment {
		return new Comment(id, authorId, text, new Date().toISOString())
	}

	static toDto(comment: Comment): CommentDto {
		return {
			id: comment.id,
			authorId: comment.authorId,
			text: comment.text,
			createdAt: comment.createdAt,
			editedAt: comment.editedAt,
		}
	}

	static toDomain(dto: CommentDto): Comment {
		return new Comment(dto.id, dto.authorId, dto.text, dto.createdAt, dto.editedAt)
	}

	static toDtos(comments: Comment[]): CommentDto[] {
		return comments.map(Comment.toDto)
	}

	static toDomains(dtos: CommentDto[]): Comment[] {
		return dtos.map(Comment.toDomain)
	}
	
	static rehydrate(dto: CommentDto): Comment {
		return new Comment(dto.id, dto.authorId, dto.text, dto.createdAt, dto.editedAt)
	}

  }