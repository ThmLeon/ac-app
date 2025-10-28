import {setContext, getContext} from "svelte";
import {get, type Writable} from "svelte/store";
import type {Database} from "@/api/supabase/database.types";

const ROLES_CONTEXT_KEY = Symbol("rolesContext");

type RolesRow = Database["public"]["Tables"]["1_RollenMitglieder"]["Row"]

export enum Roles {
    Vorstand = 17,
    VorstandFuR = 18,
    VorstandTPM = 19,
    VorstandKB = 20,
    VorstandInternes = 21,
    VorstandMPR = 22
}

export type RolesContext = {
    userRawRoles: Writable<RolesRow[]>;
    userIsAppAdmin: Writable<boolean>;
    userHasRole: (role: Roles) => boolean;
    userIsTeamleiter: (role: Roles) => boolean;
    userHasAnyRole: (...roles: Roles[]) => boolean;
    userHasAllRoles: (...roles: Roles[]) => boolean;
}

/**
 * Create a RolesContext where the helper functions always read the latest
 * value from the provided `userRawRoles` store using `get(...)`.
 *
 * Usage:
 *   const ctx = createRolesContext(userRawRolesStore);
 *   setRolesContext(ctx);
 */
export function createRolesContext(userRawRoles: Writable<RolesRow[]>, userIsAppAdmin: Writable<boolean>): RolesContext {
    const userHasRole = (role: Roles) => {
        const roles = get(userRawRoles) || [];
        return roles.some(r => r.RollenID === role);
    };

    const userIsTeamleiter = (role: Roles) => {
        const roles = get(userRawRoles) || [];
        return roles.some(r => r.RollenID === role && Boolean(r.LeitendeFunktion));
    };

    const userHasAnyRole = (...rolesToCheck: Roles[]) => {
        if (!rolesToCheck || rolesToCheck.length === 0) return false;
        return rolesToCheck.some(role => userHasRole(role));
    };

    const userHasAllRoles = (...rolesToCheck: Roles[]) => {
        if (!rolesToCheck || rolesToCheck.length === 0) return false;
        return rolesToCheck.every(role => userHasRole(role));
    };

    return {
        userRawRoles,
        userIsAppAdmin,
        userHasRole,
        userIsTeamleiter,
        userHasAnyRole,
        userHasAllRoles
    };
}

export function setRolesContext(value: RolesContext) {
    setContext<RolesContext>(ROLES_CONTEXT_KEY, value);
}

export function getRolesContext(): RolesContext {
    return getContext<RolesContext>(ROLES_CONTEXT_KEY);
}