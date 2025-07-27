import { getAllCostCentersWithBudgetsBySemester } from '@/server/database/finanzen.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const data = await getAllCostCentersWithBudgetsBySemester('SoSe25');
	return { data };
};
