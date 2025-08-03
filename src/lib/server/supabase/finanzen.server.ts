import { throwFetchErrorIfNeeded } from '@/utils/utils.server';
import { supabaseServerClient } from './supabaseServerClient.server';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';

type CostCenter = {
	id: string;
	name: string;
	eltern_kostenstelle: string | null;
	rang: number;
	finanzen_budgets: Array<Record<string, any>>;
};
type CostCenterNode = CostCenter & {
	children: CostCenterNode[];
	totalBetragBeantragt: number;
	totalBetragFreigegeben: number;
	totalBudget: number;
};

export async function getAllCostCentersWithBudgetsBySemester(semester: string) {
	let { data, error } = await supabaseServerClient()
		.from('finanzen_kostenstellen')
		.select(
			`id, name, eltern_kostenstelle, rang,
		finanzen_budgets(*)
		`
		)
		.eq('finanzen_budgets.semester', semester)
		.order('rang', { ascending: true });

	const costCenters = throwFetchErrorIfNeeded(
		data,
		error,
		'Budgets konnten nicht geladen werden'
	) as CostCenter[];

	// 1) Wrap each center into a node with an empty children array
	const nodes: CostCenterNode[] = costCenters.map((c) => ({
		...c,
		children: [],
		totalBetragBeantragt: 0,
		totalBetragFreigegeben: 0,
		totalBudget: 0
	}));

	// 2) Build a lookup map by name (eltern_kostenstelle holds the name)
	const lookup = new Map<string, CostCenterNode>();
	nodes.forEach((n) => lookup.set(n.name, n));

	// 3) Attach children to parents, collect roots
	const tree: CostCenterNode[] = [];
	nodes.forEach((n) => {
		if (n.eltern_kostenstelle && lookup.has(n.eltern_kostenstelle)) {
			lookup.get(n.eltern_kostenstelle)!.children.push(n);
		} else {
			tree.push(n);
		}
	});

	// 4) Compute totalBudget (own + all descendants) for each root
	function computeBudgets(node: CostCenterNode): { beantragt: number; freigegeben: number } {
		// sum own budgets
		const beantragtSum = node.finanzen_budgets.reduce(
			(sum, b) => sum + (typeof b.betrag_beantragt === 'number' ? b.betrag_beantragt : 0),
			0
		);
		const freigegebenSum = node.finanzen_budgets.reduce(
			(sum, b) => sum + (typeof b.betrag_freigegeben === 'number' ? b.betrag_freigegeben : 0),
			0
		);

		// accumulate children
		let childBeantragt = 0;
		let childFreigegeben = 0;
		for (const child of node.children) {
			const { beantragt, freigegeben } = computeBudgets(child);
			childBeantragt += beantragt;
			childFreigegeben += freigegeben;
		}

		// assign totals
		node.totalBetragBeantragt = beantragtSum + childBeantragt;
		node.totalBetragFreigegeben = freigegebenSum + childFreigegeben;
		node.totalBudget = node.totalBetragBeantragt + node.totalBetragFreigegeben;
		return { beantragt: node.totalBetragBeantragt, freigegeben: node.totalBetragFreigegeben };
	}

	tree.forEach(computeBudgets);
	return tree;
}
