<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { SvelteFlow, Background, Controls } from '@xyflow/svelte';
	import type { Node, Edge } from '@xyflow/svelte';
	import RoleNode from '$lib/components/pages/mitglieder/rollenliste/RoleNode.svelte';

	type Role = {
		id: string;
		name: string;
		members: { name: string; isTeamleiter?: boolean }[];
		children?: Role[];
	};

	// Dummy data: simple org tree
	const org: Role = {
		id: 'board',
		name: 'Vorstand',
		members: [{ name: 'Max Mustermann', isTeamleiter: true }, { name: 'Erika Muster' }],
		children: [
			{
				id: 'ops',
				name: 'Operations',
				members: [{ name: 'Hans Müller', isTeamleiter: true }],
				children: [
					{ id: 'team1', name: 'Team Orga 1', members: [{ name: 'Anna' }, { name: 'Ben' }] },
					{ id: 'team2', name: 'Team Orga 2', members: [{ name: 'Chris' }] }
				]
			},
			{
				id: 'sales',
				name: 'Sales',
				members: [{ name: 'Lena', isTeamleiter: true }],
				children: [{ id: 'team3', name: 'Akquise', members: [{ name: 'Tom' }, { name: 'Nina' }] }]
			}
		]
	};

	// Layout: simple top-down tree, fixed node size
	const NODE_W = 240;
	const NODE_H = 100;
	const X_GAP = 48;
	const Y_GAP = 120;

	function measureSubtreeWidth(role: Role): number {
		if (!role.children || role.children.length === 0) return NODE_W;
		const childrenWidths = role.children.map(measureSubtreeWidth);
		return Math.max(
			NODE_W,
			childrenWidths.reduce((a, b) => a + b, 0) + X_GAP * (role.children.length - 1)
		);
	}

	function buildGraph(role: Role, originX: number, depth: number, nodes: Node[], edges: Edge[]) {
		const subtreeW = measureSubtreeWidth(role);
		const x = originX + subtreeW / 2 - NODE_W / 2;
		const y = depth * (NODE_H + Y_GAP);
		nodes.push({
			id: role.id,
			type: 'roleNode',
			position: { x, y },
			data: { name: role.name, members: role.members }
		});

		if (!role.children || role.children.length === 0) return;
		let childX = originX;
		for (const child of role.children) {
			const w = measureSubtreeWidth(child);
			buildGraph(child, childX, depth + 1, nodes, edges);
			edges.push({
				id: `${role.id}-${child.id}`,
				source: role.id,
				target: child.id,
				type: 'smoothstep'
			});
			childX += w + X_GAP;
		}
	}

	const nodes: Node[] = [];
	const edges: Edge[] = [];
	const totalW = measureSubtreeWidth(org);
	buildGraph(org, 0, 0, nodes, edges);

	const nodeTypes = { roleNode: RoleNode } as const;
</script>

<section class="p-6 space-y-4">
	<h1 class="text-2xl font-semibold">Rollenliste (Org Chart)</h1>
	<div class="h-[70vh] rounded-md border">
		<SvelteFlow class="h-full w-full" {nodes} {edges} {nodeTypes} fitView>
			<Background />
			<Controls />
		</SvelteFlow>
	</div>
</section>
