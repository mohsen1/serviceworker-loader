import path from 'path';
import compile, {
	fs,
	pathToArtifacts
} from './compile';

describe('service-worker-loader', () => {

	it('should emit bundle and service worker', async () => {

		const stats = await compile('serviceWorkerLoader.js', {});
		const {
			source: serviceWorkerLoaderSource
		} = stats.modules[0].modules[1];
		const {
			source: serviceWorkerSource
		} = stats.children[0].modules[0];

		expect(serviceWorkerLoaderSource).toMatchSnapshot();
		expect(serviceWorkerSource).toMatchSnapshot();
		expect(
			fs.statSync(
				path.join(pathToArtifacts, 'serviceWorker.js')
			).isFile()
		).toBe(true);
	});

	it('should emit service worker to output path', async () => {

		const outputPath = path.join(pathToArtifacts, 'sw');

		fs.mkdirSync(outputPath);

		await compile('serviceWorkerLoader.js', {
			outputPath
		});

		expect(
			fs.statSync(
				path.join(outputPath, 'serviceWorker.js')
			).isFile()
		).toBe(true);
	});
});
