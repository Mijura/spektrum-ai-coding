import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { TicketRepository } from "@domain/repositories/ticket-repository"
import { Ticket } from "@domain/entities/ticket"
import { TicketMapper } from "@domain/mappers/ticket-mapper"
import { TicketDto } from "@application/dto/ticket"

// DynamoDB client setup
const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBTicketRepository implements TicketRepository {


	async save(ticket: Ticket): Promise<Ticket> {
		const tableName = process.env.TICKET_TABLE

		console.log(`Saving ticket with ${ticket.id} to dynamodb table ${tableName}.`)

		const ticketDto: TicketDto = TicketMapper.toDto(ticket)

		const params = {
			TableName: tableName,
			Item: ticketDto,
		}

		await ddbDocClient.send(new PutCommand(params))

		return ticket
	}

	async findById(id: string): Promise<Ticket | null> {
		const tableName = process.env.TICKET_TABLE

		console.log(`Fetching ticket with id ${id} from dynamodb table ${tableName}.`)
		const params = {
			TableName: tableName,
			Key: { id },
		}

		const { Item: item } = await ddbDocClient.send(new GetCommand(params))

		if (!item) throw new Error(`Ticket not found!`)

		const ticketDto: TicketDto = item as TicketDto

		return TicketMapper.toDomain(ticketDto)
	}

	async findAll(projectId: string): Promise<Ticket[]> {

		const tableName = process.env.TICKET_TABLE

		console.log(`Fetching all tickets for project with ${projectId} from dynamodb table ${tableName}.`)
		const params = {
			KeyConditionExpression: "projectId = :projectId",
			IndexName: "projectGSI",
			ExpressionAttributeValues: {
				":projectId": projectId
			},
			TableName: tableName,
		}
	
		const data = await ddbDocClient.send(new QueryCommand(params))
		const items = data.Items as []
	
		return TicketMapper.toDomains(items)
	}
}