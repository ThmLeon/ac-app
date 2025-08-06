import { fail, error as svelteError } from '@sveltejs/kit';
import { getGraphClient } from './sharepointClient.server';
import { listIds } from './listIds.server';

type ListName = keyof typeof listIds;

class SharepointList {
	private listId: string;
	private databaseUrl: string = '/sites/academyconsult.sharepoint.com:/sites/database:/lists/';

	constructor(listName: ListName) {
		if (!listIds[listName]) throw svelteError(404, 'Sharepoint List ' + listName + ' not found');
		this.listId = listIds[listName];
	}

	public async all() {
		try {
			const client = await getGraphClient();
			const response = await client
				.api(`${this.databaseUrl}${this.listId}/items`)
				.expand('fields')
				.get();
			return response.value;
		} catch (error: any) {
			return new Error('Sharepoint Fetch Error');
		}
	}
	public async getByFieldValue(fieldName: string, fieldValue: string) {
		try {
			const client = await getGraphClient();
			const response = await client
				.api(`${this.databaseUrl}${this.listId}/items`)
				.filter(`${fieldName} eq '${fieldValue}'`)
				.expand('fields')
				.get();
			return response.value;
		} catch (error: any) {
			return new Error('Sharepoint Fetch Error');
		}
	}
	public async create(fields: Record<string, any>) {
		try {
			const client = await getGraphClient();
			const response = await client.api(`${this.databaseUrl}${this.listId}/items`).post({
				fields: fields
			});
			return response;
		} catch (error: any) {
			return new Error('Sharepoint Fetch Error');
		}
	}
	public async update(itemId: string, fields: Record<string, any>) {
		try {
			const client = await getGraphClient();
			const response = await client
				.api(`${this.databaseUrl}${this.listId}/items/${itemId}/fields`)
				.patch(fields);
			return response;
		} catch (error: any) {
			console.log(error);
			return new Error('Sharepoint Update Error');
		}
	}

	public static async getListIdByName(listName: string) {
		try {
			const client = await getGraphClient();
			const response = await client
				.api('/sites/academyconsult.sharepoint.com:/sites/database:/lists')
				.get();

			const list = response.value?.find(
				(list: any) => list.name === listName || list.displayName === listName
			);

			return list ? list.id : null;
		} catch (error: any) {
			return new Error('Failed to fetch list by name');
		}
	}
}

export default SharepointList;
