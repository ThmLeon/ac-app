import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eventBewerbungSchema } from '@/schemas/eventBewerbungSchema';

export const load = async () => {
	const form = await superValidate(zod(eventBewerbungSchema));
	return { form };
};
