
import { CommentDto } from '@application/dto/issue'
import { v4 as uuidv4 } from 'uuid'
export class Comment {
	public readonly id: string
	public readonly authorId: string
	public text: string
	public readonly createdAt: string
	public editedAt: string | null

	constructor(
	  id: string,
	  authorId: string,
	  text: string,
	  createdAt: string,
	  editedAt: string | null
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
		return new Comment(id, authorId, text, new Date().toISOString(), null)
	}
	
	static rehydrate(dto: CommentDto): Comment {
		return new Comment(dto.id, dto.authorId, dto.text, dto.createdAt, dto.editedAt)
	}

  }