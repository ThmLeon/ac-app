import { error } from '@sveltejs/kit';
import { getSchulungInstanceById } from '$lib/data/mockSchulungenMasters';

export const load = async ({ params }) => {
	const id = Number(params.schulungId);

	if (Number.isNaN(id)) {
		throw error(404, 'Schulung nicht gefunden');
	}

	const result = getSchulungInstanceById(id);

	if (!result) {
		throw error(404, 'Schulung nicht gefunden');
	}

	const { master, instance } = result;

	const instanceWithMeta = {
		...instance,
		masterId: master.id,
		masterName: master.name
	};

	return {
		master,
		instance: instanceWithMeta
	};
};
