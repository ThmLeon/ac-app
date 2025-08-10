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

	public async create(fields: Record<string, any>) {
		const copiedFields = { ...fields };
		delete copiedFields.id;
		delete copiedFields.ID;
		if (copiedFields.Titel) {
			copiedFields.Title = fields.Titel;
			delete copiedFields.Titel;
		}
		try {
			const client = await getGraphClient();
			const response = await client.api(`${this.databaseUrl}${this.listId}/items`).post({
				fields: copiedFields
			});
			return response.fields.id as number;
		} catch (error: any) {
			console.log('Sharepoint Create Error:', error);
			return new Error('Sharepoint Fetch Error');
		}
	}
	public async update(itemId: number, fields: Record<string, any>) {
		const copiedFields = { ...fields };
		if (copiedFields.id) {
			delete copiedFields.id;
		}
		if (copiedFields.ID) {
			delete copiedFields.ID;
		}
		if (copiedFields.Titel) {
			copiedFields.Title = copiedFields.Titel;
			delete copiedFields.Titel;
		}
		try {
			const client = await getGraphClient();
			const response = await client
				.api(`${this.databaseUrl}${this.listId}/items/${itemId}/fields`)
				.patch(copiedFields);
			//everything worked fine, return null
			return null;
		} catch (error: any) {
			console.log(error);
			return new Error('Sharepoint Update Error');
		}
	}

	public async delete(itemId: number) {
		try {
			const client = await getGraphClient();
			const response = await client
				.api(`${this.databaseUrl}${this.listId}/items/${itemId}`)
				.delete();
			return null; //everything worked fine, return null
		} catch (error: any) {
			return new Error('Sharepoint Delete Error');
		}
	}

	// Returns the list's columns (fields). Set includeHidden=false to exclude hidden columns.
	public async getFields(includeHidden: boolean = true) {
		try {
			const client = await getGraphClient();
			const base = `${this.databaseUrl}${this.listId}/columns`;
			const url = includeHidden ? base : `${base}?$filter=hidden eq false`;
			const response = await client.api(url).get();
			return response.value as Array<{
				id: string;
				name: string; // internal name
				displayName?: string;
				hidden?: boolean;
				required?: boolean;
				indexed?: boolean;
				description?: string;
				columnGroup?: string;
			}>;
		} catch (error: any) {
			console.log('Sharepoint Get Fields Error:', error);
			return new Error('Sharepoint Fetch Error');
		}
	}
}

export default SharepointList;
