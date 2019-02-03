/* eslint-env serviceworker */
/* eslint-disable import/unambiguous */

self.addEventListener('install', () => {
	postMessageToAll({
		action: 'install'
	});
});

self.addEventListener('activate', () => {
	postMessageToAll({
		action: 'activate'
	});
});

self.addEventListener('fetch', (event) => {
	postMessageToAll({
		action:  'fetch',
		payload: event.request.url
	});
});

async function postMessageToAll(message) {

	const clients = await self.clients.matchAll();

	return Promise.all(
		clients.map(client => client.postMessage(message))
	);
}
