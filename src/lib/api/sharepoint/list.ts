import { listIds } from './listIds';
import { getSharepointClient } from './sharepointClient';

const databaseUrl = '/sites/academyconsult.sharepoint.com:/sites/database:/lists/';

type ListName = keyof typeof listIds;

export class SharepointList {
        private readonly listId: string;

        constructor(listName: ListName) {
                const listId = listIds[listName];
                if (!listId) {
                        throw new Error(`SharePoint list ${listName.toString()} not found.`);
                }

                this.listId = listId;
        }

        private normaliseFields(fields: Record<string, unknown>) {
                const normalised = { ...fields } as Record<string, unknown>;
                delete normalised.id;
                delete normalised.ID;
                if (typeof normalised.Titel !== 'undefined') {
                        normalised.Title = normalised.Titel;
                        delete normalised.Titel;
                }

                return normalised;
        }

        public async create(fields: Record<string, unknown>) {
                const client = getSharepointClient();
                const response = await client
                        .api(`${databaseUrl}${this.listId}/items`)
                        .post({ fields: this.normaliseFields(fields) });

                return response.fields.id as number;
        }

        public async update(itemId: number, fields: Record<string, unknown>) {
                const client = getSharepointClient();
                await client
                        .api(`${databaseUrl}${this.listId}/items/${itemId}/fields`)
                        .patch(this.normaliseFields(fields));
        }

        public async delete(itemId: number) {
                const client = getSharepointClient();
                await client.api(`${databaseUrl}${this.listId}/items/${itemId}`).delete();
        }

        public async deleteAllWhereEquals(fieldName: string, value: string | number) {
                const client = getSharepointClient();
                const response = await client
                        .api(`${databaseUrl}${this.listId}/items?$filter=fields/${fieldName} eq '${value}'`)
                        .get();

                if (response.value && Array.isArray(response.value)) {
                        for (const item of response.value) {
                                await this.delete(item.id);
                        }
                }
        }

        public async getFields(includeHidden: boolean = true) {
                const client = getSharepointClient();
                const base = `${databaseUrl}${this.listId}/columns`;
                const url = includeHidden ? base : `${base}?$filter=hidden eq false`;

                const response = await client.api(url).get();
                return response.value as Array<{
                        id: string;
                        name: string;
                        displayName?: string;
                        hidden?: boolean;
                        required?: boolean;
                        indexed?: boolean;
                        description?: string;
                        columnGroup?: string;
                }>;
        }
}
