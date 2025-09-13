export const GET = () =>
	new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
		headers: { 'content-type': 'application/json' }
	});
