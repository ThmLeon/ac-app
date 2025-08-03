import { getGraphClient } from './sharepointClient.server';

const siteId =
	'academyconsult.sharepoint.com,b57543b9-c8fa-48ae-9e02-0082785f1c94,f96372d3-b7a1-4d7e-9889-7dfe12692b10';
const listId = '<your-list-id>';

export async function getAllLists() {
	console.log('Fetching all lists from SharePoint...');
	const client = await getGraphClient();
	const response = await client.api('/sites/academyconsult.sharepoint.com:/sites/database').get();

	console.log(response);
}
