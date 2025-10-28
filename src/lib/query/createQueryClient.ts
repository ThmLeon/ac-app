import { Mutation, MutationCache, QueryCache, QueryClient } from '@sveltestack/svelte-query';
import { toast } from 'svelte-sonner';

export type ToastMeta = {
	/** Alles aus?*/
	silent?: boolean;
	/** Texte je Phase; false = unterdrücken */
	loading?: string | false;
	success?: string | false;
};

declare module '@sveltestack/svelte-query' {
	// erweitert die Options-Typen um "meta"
	interface UseMutationOptions<
		TData = unknown,
		TError = unknown,
		TVariables = void,
		TContext = unknown
	> {
		meta?: ToastMeta;
	}
}

let queryClient: QueryClient | null = null;

export default function createQueryClient() {
	if (queryClient) return queryClient;
	else {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 5 * 60 * 1000,
					refetchOnWindowFocus: false,
					retry: 1,
					enabled: true,
					keepPreviousData: true
				},
				mutations: { retry: 0 }
			},
			mutationCache: new MutationCache({
				onMutate: (_vars, _mutation) => {
					const meta = (_mutation.options.meta ?? {}) as ToastMeta;
					if (meta.silent || meta.loading === false) return;
					toast.loading(meta.loading ?? 'Lädt...');
				},
				onSuccess: (data, _vars, _ctx, _mutation) => {
					toast.dismiss();
					const meta = (_mutation.options.meta ?? {}) as ToastMeta;
					if (meta.silent || meta.success === false) return;
					toast.success(meta.success ?? 'Aktion erfolgreich');
				},
				onError: (error) => {
					toast.dismiss();
					if (error instanceof Error) {
						toast.error(error.message);
					} else {
						toast.error('Ein Fehler ist aufgetreten');
					}
				}
			}),
			queryCache: new QueryCache({
				onError: (error) => {
					if (error instanceof Error) {
						toast.error(error.message);
					} else {
						toast.error('Ein Fehler ist aufgetreten');
					}
				}
			})
		});
		return queryClient;
	}
}
