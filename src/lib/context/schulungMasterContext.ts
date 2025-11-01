import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { SchulungMaster } from '$lib/data/mockSchulungenMasters';

export type SchulungMasterContext = {
	master: Writable<SchulungMaster | null>;
};

const SCHULUNG_MASTER_CONTEXT_KEY = Symbol('schulung-master-context');

export function setSchulungMasterContext(context: SchulungMasterContext) {
	setContext(SCHULUNG_MASTER_CONTEXT_KEY, context);
}

export function getSchulungMasterContext(): SchulungMasterContext {
	return getContext<SchulungMasterContext>(SCHULUNG_MASTER_CONTEXT_KEY);
}
