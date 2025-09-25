<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { SvelteFlow, Background, Controls, type Node, type Edge } from '@xyflow/svelte';
	import RoleNode from './RoleNode.svelte';
	import type { Rolle } from '@/state/MitgliederRollen.svelte';
	import { onMount } from 'svelte';

	// Props via $props() (Svelte 5 Runes)
	const { root = null, disabled = false } = $props<{ root?: Rolle | null; disabled?: boolean }>();

	// Interne Flow States
	let nodes: Node[] = $state([]);
	let edges: Edge[] = $state([]);
	const nodeTypes = { roleNode: RoleNode } as const;

	// Layout Konstanten
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

	function buildGraph(
		role: Rolle,
		originX: number,
		depth: number,
		nodesAcc: Node[],
		edgesAcc: Edge[]
	) {
		const subtreeW = measureSubtreeWidth(role);
		const x = originX + subtreeW / 2 - NODE_W / 2;
		const y = depth * (NODE_H + Y_GAP);
		nodesAcc.push({
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
			buildGraph(child, childX, depth + 1, nodesAcc, edgesAcc);
			edgesAcc.push({
				id: `${role.ID}-${child.ID}`,
				source: role.ID.toString(),
				target: child.ID.toString(),
				type: 'smoothstep'
			});
			childX += w + X_GAP;
		}
	}

	function rebuild() {
		if (!root || !root.Children) return;
		const n: Node[] = [];
		const e: Edge[] = [];
		buildGraph(root, 0, 0, n, e);
		nodes = n;
		edges = e;
	}

	onMount(() => {
		rebuild();
	});

	$effect(() => {
		rebuild();
	});
</script>

<div class="h-full w-full">
	{#if nodes.length}
		<SvelteFlow
			{nodes}
			{edges}
			{nodeTypes}
			fitView
			minZoom={0.1}
			maxZoom={2}
			nodesDraggable={false}
			class="h-full w-full"
		>
			<Background />
			<Controls showLock={false} />
		</SvelteFlow>
	{:else}
		<div class="flex h-full items-center justify-center text-sm text-muted-foreground">
			Keine Daten für das Organigramm.
		</div>
	{/if}
</div>
