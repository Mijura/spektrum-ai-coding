import { CommentDto } from "@application/dto/ticket"
import { v4 as uuidv4 } from 'uuid'
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

	static create(authorId: string, text: string): Comment {
		const id = uuidv4()
		return new Comment(id, authorId, text, new Date().toISOString())
	}
	
	static rehydrate(dto: CommentDto): Comment {
		return new Comment(dto.id, dto.authorId, dto.text, dto.createdAt, dto.editedAt)
	}

  }