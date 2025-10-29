import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	//todo add error if no eventId
	const eventId = params.eventId;
	return { eventId };
};
