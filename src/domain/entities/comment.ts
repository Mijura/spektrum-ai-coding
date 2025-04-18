export class Comment {
	constructor(
	  public readonly id: string,
	  public readonly authorId: string,
	  public text: string,
	  public readonly createdAt: Date = new Date(),
	  public editedAt?: Date
	) {}
  
	edit(newText: string) {
	  this.text = newText
	  this.editedAt = new Date()
	}
  }