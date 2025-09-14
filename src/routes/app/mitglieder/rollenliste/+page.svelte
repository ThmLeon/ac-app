<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { SvelteFlow, Background, Controls } from '@xyflow/svelte';
	import type { Node, Edge } from '@xyflow/svelte';
	import RoleNode from '$lib/components/pages/mitglieder/rollenliste/RoleNode.svelte';
	import { getMitgliederRollenState, type Rolle } from '@/state/MitgliederRollen.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(async () => {
		const mitgliederRollenState = getMitgliederRollenState(data.supabase);
		await mitgliederRollenState.loadOrganisation();
		buildGraph(mitgliederRollenState.organisation, 0, 0, nodes, edges);
	});

	// Layout: simple top-down tree, fixed node size
	// Make nodes a bit narrower and reduce horizontal gap to densify layout
	const NODE_W = 200;
	const NODE_H = 100;
	const X_GAP = 10;
	const Y_GAP = 100;

	function measureSubtreeWidth(role: Rolle): number {
		if (!role.Children || role.Children.length === 0) return NODE_W;
		const childrenWidths = role.Children.map(measureSubtreeWidth);
		return Math.max(
			NODE_W,
			childrenWidths.reduce((a, b) => a + b, 0) + X_GAP * (role.Children.length - 1)
		);
	}

	function buildGraph(role: Rolle, originX: number, depth: number, nodes: Node[], edges: Edge[]) {
		const subtreeW = measureSubtreeWidth(role);
		const x = originX + subtreeW / 2 - NODE_W / 2;
		const y = depth * (NODE_H + Y_GAP);
		nodes.push({
			id: role.ID.toString(),
			type: 'roleNode',
			position: { x, y },
			data: {
				name: role.Titel ?? '',
				members: (role.Mitglieder ?? []).map((m) => ({
					name: m.Titel ?? '',
					isTeamleiter: m.LeitendeFunktion ?? false
				}))
			}
		});

		if (!role.Children || role.Children.length === 0) return;
		let childX = originX;
		for (const child of role.Children) {
			const w = measureSubtreeWidth(child);
			buildGraph(child, childX, depth + 1, nodes, edges);
			edges.push({
				id: `${role.ID}-${child.ID}`,
				source: role.ID.toString(),
				target: child.ID.toString(),
				type: 'smoothstep'
			});
			childX += w + X_GAP;
		}
	}

	let nodes: Node[] = $state([]);
	let edges: Edge[] = $state([]);

	const nodeTypes = { roleNode: RoleNode } as const;
</script>

<section class="p-6 space-y-4">
	<h1 class="text-2xl font-semibold">Rollenliste (Org Chart)</h1>
	<div class="h-[70vh] rounded-md border">
		{#if nodes.length}
			<SvelteFlow
				class="h-full w-full"
				{nodes}
				{edges}
				{nodeTypes}
				fitView
				minZoom={0.1}
				maxZoom={2}
				nodesDraggable={false}
			>
				<Background />
				<Controls showLock={false} />
			</SvelteFlow>
		{/if}
	</div>
</section>
