import { browser } from '$app/environment';
import { Client } from '@microsoft/microsoft-graph-client';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import 'isomorphic-fetch';
import { readable, type Readable } from 'svelte/store';

let supabaseClient: SupabaseClient | null = null;
let graphClient: Client | null = null;

async function fetchMicrosoftAccessToken(): Promise<string> {
        if (!supabaseClient) {
                throw new Error('Supabase client is not initialised for SharePoint access.');
        }

        const {
                data: { session },
                error
        } = await supabaseClient.auth.getSession();

        if (error) {
                throw error;
        }

        const accessToken = session?.provider_token;

        if (!accessToken) {
                throw new Error('No Microsoft access token available in the current session.');
        }

        return accessToken;
}

function createGraphClient(): Client {
        if (!graphClient) {
                graphClient = Client.init({
                        authProvider: async (done) => {
                                try {
                                        const token = await fetchMicrosoftAccessToken();
                                        done(null, token);
                                } catch (err) {
                                        done(err as Error, null);
                                }
                        }
                });
        }

        return graphClient;
}

function resetGraphClient() {
        graphClient = null;
}

function handleSession(session: Session | null, set: (client: Client | null) => void) {
        if (session?.provider_token) {
                const client = createGraphClient();
                set(client);
        } else {
                resetGraphClient();
                set(null);
        }
}

export function createSharepointClientStore(
        supabase: SupabaseClient
): Readable<Client | null> {
        if (!browser) {
                return readable<Client | null>(null);
        }

        supabaseClient = supabase;

        return readable<Client | null>(null, (set) => {
                let active = true;

                async function initialiseFromCurrentSession() {
                        try {
                                const {
                                        data: { session }
                                } = await supabase.auth.getSession();
                                if (!active) return;
                                handleSession(session, set);
                        } catch (err) {
                                console.error('Failed to initialise SharePoint client', err);
                                set(null);
                        }
                }

                initialiseFromCurrentSession();

                const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                        handleSession(session, set);
                });

                return () => {
                        active = false;
                        data.subscription.unsubscribe();
                        resetGraphClient();
                        supabaseClient = null;
                };
        });
}

export function getSharepointClient(): Client {
        if (!graphClient) {
                throw new Error('SharePoint client has not been initialised yet.');
        }
        return graphClient;
}
