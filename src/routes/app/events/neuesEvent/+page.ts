import { eventMasterSchema } from '@/schemas/eventMasterSchema';
import { newEventSchema } from '@/schemas/newEventSchema.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, fetch }) => {
	const form = await superValidate(zod(newEventSchema));
	return { form };
};
