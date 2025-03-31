import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { TicketStorage } from "@domain/persistence/ticket-storage"
import { Ticket } from "@domain/entities/ticket"
import { TicketMapper } from "@domain/mappers/ticket-mapper"
import { TicketDto } from "@application/dto/ticket"

// DynamoDB client setup
const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBTicketRepository implements TicketStorage {

	async save(ticket: Ticket): Promise<Ticket> {
		const tableName = process.env.TICKET_TABLE

		console.log(`User is trying to save ticket with ${ticket.id} to dynamodb table ${tableName}.`)

		const ticketDto: TicketDto = TicketMapper.toDto(ticket)

		const params = {
			TableName: tableName,
			Item: ticketDto,
		}

		await ddbDocClient.send(new PutCommand(params))

		return ticket
	}

	async findAll(projectId: string): Promise<Ticket[]> {

		const tableName = process.env.TICKET_TABLE

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