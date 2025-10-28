import {setContext, getContext} from "svelte";
import type {Writable} from "svelte/store";
import type {Database} from "@/api/supabase/database.types";
import type {User} from "@supabase/supabase-js";

const USER_CONTEXT_KEY = Symbol("userContext");



export type UserContext =  {
    userDetails : Writable<Database["public"]["Tables"]["1_Mitglieder"]["Row"]>;
    user : Writable<User>;
}

export function setUserContext(value: UserContext) {
    setContext<UserContext>(USER_CONTEXT_KEY, value);
}

export function getUserContext(): UserContext {
    return getContext<UserContext>(USER_CONTEXT_KEY);
}