<script lang="ts">
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import {
		getLocalTimeZone,
		CalendarDate,
		fromDate,
		toCalendarDate
	} from '@internationalized/date';
	import type { CalendarDate as CalendarDateType } from '@internationalized/date';

	// Receive id and name from the parent so that the component can
	// participate in native form submission. Any additional attributes
	// are collected in `restProps` and forwarded to the hidden input
	// element used for the actual form value.
	let {
		value = $bindable(),
		id,
		name,
		...restProps
	}: { value?: Date; id: string; name: string } & Record<string, unknown> = $props();

	let open = $state(false);
	let calendarValue = $state<CalendarDateType | undefined>();
	let timeValue = $state('10:30:00');

	// Reactive value for the hidden input. It converts the selected
	// date and time into the `datetime-local` format expected by the
	// server (e.g. 2024-06-01T10:30:00).
	const pad = (n: number) => String(n).padStart(2, '0');
	const hiddenValue = $derived(
		value
			? `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(
					value.getMinutes()
				)}:${pad(value.getSeconds())}`
			: ''
	);

	// Sync calendar and time when external value changes
	$effect(() => {
		if (value) {
			calendarValue = toCalendarDate(fromDate(value, getLocalTimeZone()));
			timeValue = value.toTimeString().slice(0, 8);
		} else {
			calendarValue = undefined;
			timeValue = '10:30:00';
		}
	});

	// Update external value when calendar or time changes
	function updateValue() {
		if (calendarValue && timeValue) {
			const [hours, minutes, seconds] = timeValue.split(':').map(Number);
			const date = calendarValue.toDate(getLocalTimeZone());
			date.setHours(hours, minutes, seconds);
			value = date;
		} else if (calendarValue) {
			const [hours, minutes, seconds] = timeValue.split(':').map(Number);
			const date = calendarValue.toDate(getLocalTimeZone());
			date.setHours(hours, minutes, seconds);
			value = date;
		}
	}
</script>

<div class="flex gap-4">
	<!-- Hidden input carries the actual value submitted with the form -->
	<input type="hidden" {id} {name} value={hiddenValue} {...restProps} />
	<div class="flex flex-col gap-3">
		<Popover.Root bind:open>
			<Popover.Trigger id="{id}-date">
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="w-32 justify-between font-normal">
						{calendarValue
							? calendarValue.toDate(getLocalTimeZone()).toLocaleDateString()
							: 'Datum'}
						<ChevronDownIcon />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto overflow-hidden p-0" align="start">
				<Calendar
					type="single"
					bind:value={calendarValue}
					onValueChange={() => {
						open = false;
						updateValue();
					}}
					captionLayout="dropdown"
				/>
			</Popover.Content>
		</Popover.Root>
	</div>
	<div class="flex flex-col gap-3">
		<Input
			type="time"
			id="{id}-time"
			step="1"
			bind:value={timeValue}
			onchange={updateValue}
			class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
		/>
	</div>
</div>
