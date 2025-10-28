import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eventBesetzungAnwesenheitSchema } from '@/schemas/eventBesetzungAnwesenheitSchema';

export const load = async () => {
	const form = await superValidate(zod(eventBesetzungAnwesenheitSchema));
	return { form };
};
