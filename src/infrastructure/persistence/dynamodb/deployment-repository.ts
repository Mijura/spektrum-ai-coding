import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// DynamoDB client setup
const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export class DynamoDBDeploymentRepository {
	// Fetch deployment history for a given projectId and environment, grouped by day
	async getDeploymentHistory(projectId: string, environment: string): Promise<{ date: string, deployments: any[] }[]> {
		const tableName = process.env.DEPLOYMENT_TABLE;

		console.log(`User is trying to fetch deployment history for project ${projectId} and environment ${environment} from DynamoDB table ${tableName}.`);

		// Define the query parameters for fetching deployments
		const params = {
			TableName: tableName,
			IndexName: "projectId_deploymentDateGSI", // Using the existing GSI
			KeyConditionExpression: "projectId = :projectId",
			ExpressionAttributeValues: {
				":projectId": projectId,
			},
			ProjectionExpression: "id, projectId, ticketId, environment, deploymentDate",
			ScanIndexForward: false // Order by descending deploymentDate
		};

		const { Items } = await ddbDocClient.send(new QueryCommand(params));

		if (!Items) throw new Error(`No deployments found for project ${projectId}.`);

		// Filter the deployments by environment programmatically
		const filteredDeployments = Items.filter(deployment => deployment.environment === environment);

		// Group the filtered deployments by day
		const groupedDeployments = this.groupDeploymentsByDay(filteredDeployments);

		// Return the grouped deployments
		return groupedDeployments;
	}

	// Helper function to group deployments by day in "Jan 24, 2025" format
	private groupDeploymentsByDay(deployments: any[]): { date: string, deployments: any[] }[] {
		const result: { [key: string]: any[] } = {};

		deployments.forEach(deployment => {
			const deploymentDate = deployment.deploymentDate;
			const formattedDate = this.formatDate(deploymentDate);

			// Group deployments by formatted date
			if (!result[formattedDate]) {
				result[formattedDate] = [];
			}
			result[formattedDate].push(deployment);
		});

		// Convert the object to an array
		return Object.keys(result).map(date => ({
			date,
			deployments: result[date],
		}));
	}

	// Helper function to format date as "Jan 24, 2025"
	private formatDate(date: string): string {
		const [year, month, day] = date.split('-');
		const dateObj = new Date(`${year}-${month}-${day}`);
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
		return dateObj.toLocaleDateString("en-US", options);
	}
}
