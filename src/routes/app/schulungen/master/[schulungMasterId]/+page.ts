import { error } from '@sveltejs/kit';
import { getSchulungMasterById } from '$lib/data/mockSchulungenMasters';

export const load = async ({ params }) => {
	const id = Number(params.schulungMasterId);

	if (Number.isNaN(id)) {
		throw error(404, 'Schulung Master nicht gefunden');
	}

	const master = getSchulungMasterById(id);

	if (!master) {
		throw error(404, 'Schulung Master nicht gefunden');
	}

	return { master };
};
