<script lang="ts">
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import type { Rolle, VB } from '@/state/MitgliederRollen.svelte';

	type FormModel = {
		rollenname: string;
		vb: VB;
		vorgesetzteRolleId: string; // '' means Keine Rolle
		beschreibung: string;
		bewerbungOffen: boolean;
		kernteam: boolean;
		rolleAktiviert: boolean;
		anzeigenImChart: boolean;
	};

	let {
		open = $bindable(false),
		form = $bindable({} as FormModel),
		editingRole = $bindable(null as Rolle | null),
		rolesForParent = [] as Rolle[]
	} = $props<{
		open?: boolean;
		form?: FormModel;
		editingRole?: Rolle | null;
		rolesForParent?: Rolle[];
	}>();

	function close() {
		open = false;
	}
</script>

<Sheet bind:open>
	<SheetContent side="right" class="w-[90vw] sm:w-[560px]">
		<SheetHeader>
			<SheetTitle>{editingRole ? 'Rolle bearbeiten' : 'Neue Rolle anlegen'}</SheetTitle>
			<SheetDescription>
				{editingRole ? `ID: ${editingRole.id}` : 'Bitte fülle die Felder aus.'}
			</SheetDescription>
		</SheetHeader>

		<div class="mt-4 space-y-4">
			<div class="space-y-2">
				<Label for="rollenname">Rollenname</Label>
				<Input id="rollenname" placeholder="z. B. Marketing" bind:value={form.rollenname} />
			</div>

			<div class="space-y-2">
				<Label>VB</Label>
				<Select type="single" bind:value={form.vb}>
					<SelectTrigger class="w-full">{form.vb}</SelectTrigger>
					<SelectContent>
						<SelectItem value="F&R">F&R</SelectItem>
						<SelectItem value="TPM">TPM</SelectItem>
						<SelectItem value="KB">KB</SelectItem>
						<SelectItem value="MPR">MPR</SelectItem>
						<SelectItem value="Internes">Internes</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div class="space-y-2">
				<Label>Vorgesetzte Rolle</Label>
				<Select type="single" bind:value={form.vorgesetzteRolleId}>
					<SelectTrigger class="w-full">
						{form.vorgesetzteRolleId === ''
							? 'Keine Rolle'
							: rolesForParent.find((r: Rolle) => r.ID === form.vorgesetzteRolleId)?.name}
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">Keine Rolle</SelectItem>
						{#each rolesForParent as r}
							<SelectItem value={r.id}>{r.name}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>

			<div class="space-y-2">
				<Label for="beschreibung">Beschreibung</Label>
				<Textarea id="beschreibung" rows={4} bind:value={form.beschreibung} />
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<label class="flex items-center gap-2">
					<Checkbox bind:checked={form.bewerbungOffen} />
					<span>Bewerbung Offen</span>
				</label>
				<label class="flex items-center gap-2">
					<Checkbox bind:checked={form.kernteam} />
					<span>Kernteam</span>
				</label>
				<label class="flex items-center gap-2">
					<Checkbox bind:checked={form.rolleAktiviert} />
					<span>Rolle Aktiviert</span>
				</label>
				<label class="flex items-center gap-2">
					<Checkbox bind:checked={form.anzeigenImChart} />
					<span>Im Organisations Chart Anzeigen</span>
				</label>
			</div>

			<div class="pt-2 flex justify-end gap-2">
				<button class={buttonVariants({ variant: 'outline' })} onclick={close}>Schließen</button>
				<button disabled>Speichern (dummy)</button>
			</div>
		</div>
	</SheetContent>
</Sheet>
