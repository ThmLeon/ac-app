import {setContext, getContext} from "svelte";
import type {Writable} from "svelte/store";
import type {Database} from "@/api/supabase/database.types";

const EVENT_CONTEXT_KEY = Symbol("eventContext");

export type EventDetails =
    Database["public"]["Tables"]["4_Events"]["Row"] & {
    eventMaster: Database["public"]["Tables"]["4_EventMaster"]["Row"] | null;
    eventVerantwortliche: Array<
        Database["public"]["Tables"]["4_EventVerantwortliche"]["Row"] & {
        mitglieder: Database["public"]["Tables"]["1_Mitglieder"]["Row"] | null;
    }
    >;
    userBewerbung: Database["public"]["Tables"]["4_EventBewerbungen"]["Row"][];
};




export type EventContext = {
    eventDetails: Writable<EventDetails | null>;
    eventImageURL: Writable<string | null>;
    totalApplications: Writable<number>;
}

export function setEventContext(value: EventContext) {
    setContext<EventContext>(EVENT_CONTEXT_KEY, value);
}

export function getEventContext(): EventContext {
    return getContext<EventContext>(EVENT_CONTEXT_KEY);
}