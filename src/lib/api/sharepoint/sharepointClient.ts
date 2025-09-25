/*import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import {
	PUBLIC_MS_CLIENT_ID,
	PUBLIC_MS_CLIENT_SECRET,
	PUBLIC_MS_TENANT_ID
	//@ts-ignore
} from '$env/static/public';

const msalConfig = {
	auth: {
		clientId: PUBLIC_MS_CLIENT_ID,
		authority: `https://login.microsoftonline.com/${PUBLIC_MS_TENANT_ID}`,
		clientSecret: PUBLIC_MS_CLIENT_SECRET
	}
};

const cca = new ConfidentialClientApplication(msalConfig);

let cachedAccessToken: string | null = null;
let cachedExpiresAt: number = 0;

export async function getGraphClient() {
	const now = Math.floor(Date.now() / 1000);

	if (!cachedAccessToken || now >= cachedExpiresAt - 60) {
		const result = await cca.acquireTokenByClientCredential({
			scopes: ['https://graph.microsoft.com/.default']
		});

		if (!result) throw new Error('Backend Sharepoint Authentication failed');

		cachedAccessToken = result.accessToken;
		cachedExpiresAt = result.expiresOn?.getTime()! / 1000;
	}

	const client = Client.init({
		authProvider: (done) => done(null, cachedAccessToken!)
	});

	return client;
}
*/
