import type { Database } from '@/database.types';

type RoleListKey = {
	RolleID: number;
	Rolle: string;
};
type RoleListValue = Database['public']['Tables']['1_RollenMitglieder']['Row'];
type RoleMap = Map<RoleListKey, RoleListValue>;

function hasRole(roles: RoleMap, RolleID: number, Rolle: string): boolean {
	return roles.has({ RolleID, Rolle });
}

function isTeamleiter(roles: RoleMap, RolleID: number, Rolle: string): boolean {
	return roles.has({ RolleID, Rolle }) && roles.get({ RolleID, Rolle })?.LeitendeFunktion === true;
}

export function isVorstand(roles: RoleMap): boolean {
	return hasRole(roles, 17, 'Vorstand');
}

export function isVorstandFuR(roles: RoleMap): boolean {
	return hasRole(roles, 18, 'Vorstand Finanzen & Recht');
}

export function isVorstandTPM(roles: RoleMap): boolean {
	return hasRole(roles, 19, 'Vorstand Technologie und Prozessmanagement');
}

export function isVorstandKB(roles: RoleMap): boolean {
	return hasRole(roles, 20, 'Vorstand Kundenbetreuung');
}

export function isVorstandInternes(roles: RoleMap): boolean {
	return hasRole(roles, 21, 'Vorstand Internes');
}

export function isVorstandMPR(roles: RoleMap): boolean {
	return hasRole(roles, 22, 'Vorstand Marketing & PR');
}
