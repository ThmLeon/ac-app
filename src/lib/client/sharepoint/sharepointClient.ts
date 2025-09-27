import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { get, writable } from 'svelte/store';
import type { Database } from '@/database.types';

export type SharepointAuthState = 'uninitialized' | 'ready' | 'requires-interactive-login';

const sharepointClient = writable<Client | null>(null);
const sharepointAuthState = writable<SharepointAuthState>(browser ? 'uninitialized' : 'ready');
const sharepointError = writable<string | null>(null);

let currentAccessToken: string | null = null;
let cachedClient: Client | null = null;
let activeSupabase: SupabaseClient<Database> | null = null;
let activeSubscription: { unsubscribe: () => void } | null = null;
let publicClientApp: PublicClientApplication | null = null;
let lastAccountId: string | null = null;

const msClientId = browser ? env.PUBLIC_MS_CLIENT_ID : undefined;
const msTenantId = browser ? env.PUBLIC_MS_TENANT_ID : undefined;
const msAuthority = msTenantId ? `https://login.microsoftonline.com/${msTenantId}` : undefined;

const defaultScopes = ['Sites.ReadWrite.All', 'User.Read', 'offline_access', 'openid', 'profile'];

function normalizeScopes(rawScopes: string[] | undefined) {
        if (!rawScopes || rawScopes.length === 0) {
                return [...defaultScopes];
        }

        const sanitized = rawScopes
                .map((scope) => scope.trim())
                .filter((scope) => scope.length > 0);

        return Array.from(new Set(sanitized.length > 0 ? sanitized : defaultScopes));
}

const sharepointScopes = normalizeScopes(
        browser && env.PUBLIC_MS_GRAPH_SCOPES
                ? env.PUBLIC_MS_GRAPH_SCOPES.split(/[,\s]+/)
                : undefined
);

function ensureGraphClient() {
        if (!cachedClient) {
                cachedClient = Client.init({
                        authProvider: (done) => {
                                if (!currentAccessToken) {
                                        done(new Error('Missing SharePoint access token'), null);
                                        return;
                                }

                                done(null, currentAccessToken);
                        }
                });
        }

        return cachedClient;
}

function clearSharepointState() {
        currentAccessToken = null;
        cachedClient = null;
        sharepointClient.set(null);
        sharepointAuthState.set('uninitialized');
        sharepointError.set(null);
}

function applyAccessToken(token: string) {
        currentAccessToken = token;
        const client = ensureGraphClient();
        sharepointError.set(null);
        sharepointClient.set(client);
        sharepointAuthState.set('ready');
}

async function syncFromSession(session: Session | null | undefined) {
        if (!browser) return;

        if (!session) {
                clearSharepointState();
                return;
        }

        if (session.provider_token) {
                applyAccessToken(session.provider_token);
                return;
        }

        sharepointClient.set(null);
        sharepointAuthState.set('requires-interactive-login');
        sharepointError.set('No Microsoft Graph access token available in the Supabase session.');
}

function ensurePublicClientApplication() {
        if (!browser) return null;
        if (!msClientId) return null;

        if (!publicClientApp) {
                publicClientApp = new PublicClientApplication({
                        auth: {
                                clientId: msClientId,
                                authority: msAuthority,
                                navigateToLoginRequestUrl: false
                        },
                        cache: {
                                cacheLocation: 'localStorage',
                                storeAuthStateInCookie: false
                        }
                });
        }

        return publicClientApp;
}

function pickAccount(instance: PublicClientApplication) {
        const accounts = instance.getAllAccounts();
        if (accounts.length === 0) return null;
        if (!lastAccountId) return accounts[0];
        return accounts.find((account) => account.homeAccountId === lastAccountId) ?? accounts[0];
}

async function acquireTokenInteractively(instance: PublicClientApplication) {
        const scopes = sharepointScopes.length > 0 ? sharepointScopes : defaultScopes;
        const account = pickAccount(instance);

        try {
                if (account) {
                        const result = await instance.acquireTokenSilent({
                                scopes,
                                account
                        });
                        return result;
                }
        } catch (error) {
                if (error instanceof InteractionRequiredAuthError) {
                        // fall through to interactive flow below
                } else {
                        throw error;
                }
        }

        if (pickAccount(instance)) {
                return await instance.acquireTokenPopup({ scopes });
        }

        return await instance.loginPopup({ scopes });
}

export function initSharepointClient(supabase: SupabaseClient<Database>) {
        if (!browser) return () => {};

        if (activeSupabase === supabase && activeSubscription) {
                return () => {
                        activeSubscription?.unsubscribe();
                        activeSubscription = null;
                        activeSupabase = null;
                };
        }

        activeSubscription?.unsubscribe();
        activeSupabase = supabase;

        void supabase.auth.getSession().then(({ data }) => {
                void syncFromSession(data.session);
        });

        const {
                data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
                void syncFromSession(session);
        });

        activeSubscription = subscription;

        return () => {
                if (activeSubscription === subscription) {
                        subscription.unsubscribe();
                        activeSubscription = null;
                        activeSupabase = null;
                } else {
                        subscription.unsubscribe();
                }
        };
}

export async function ensureSharepointInteractiveLogin() {
        if (!browser) throw new Error('Interactive Microsoft login is only available in the browser.');

        const instance = ensurePublicClientApplication();
        if (!instance) {
                const message = 'Microsoft authentication is not configured for the client.';
                sharepointError.set(message);
                throw new Error(message);
        }

        try {
                const result = await acquireTokenInteractively(instance);
                if (!result) {
                        const message = 'Microsoft login did not return an access token.';
                        sharepointError.set(message);
                        sharepointAuthState.set('requires-interactive-login');
                        throw new Error(message);
                }

                lastAccountId = result.account?.homeAccountId ?? null;
                applyAccessToken(result.accessToken);
                return get(sharepointClient);
        } catch (error) {
                sharepointAuthState.set('requires-interactive-login');
                sharepointError.set(
                        error instanceof Error ? error.message : 'Interactive Microsoft login failed.'
                );
                throw error;
        }
}

export function getCurrentSharepointClient() {
        return get(sharepointClient);
}

export { sharepointAuthState, sharepointClient, sharepointError };
