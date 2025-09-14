<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	export let id: string;
	export let data: {
		name: string;
		members: { name: string; isTeamleiter?: boolean }[];
	};
</script>

<div
	data-node-id={id}
	class="relative rounded-md border bg-card text-card-foreground shadow-sm w-[200px] overflow-hidden"
>
	<div class="px-3 py-2 font-semibold bg-[#993333] text-white text-center">{data.name}</div>
	<div class="px-3 py-2 text-sm space-y-1">
		{#if data.members && data.members.length > 0}
			{#each data.members as m}
				<p class={m.isTeamleiter ? 'font-semibold' : ''}>
					{m.name}{m.isTeamleiter ? ' (Teamleiter)' : ''}
				</p>
			{/each}
		{/if}
	</div>
	<!-- Handles are implicit; using edges only for org chart -->
	<Handle type="target" position={Position.Top} class="opacity-0 pointer-events-none" />
	<Handle type="source" position={Position.Bottom} class="opacity-0 pointer-events-none" />
</div>
