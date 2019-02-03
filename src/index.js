import path from 'path';
import util from 'util';
import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import WebWorkerTemplatePlugin from 'webpack/lib/webworker/WebWorkerTemplatePlugin';
import { onCompilerHook } from './utils';
import getServiceWorker from './serviceWorker';
import LoaderError from './LoaderError';
import schema from './options.json';

export default function loader() {
}

export function pitch(request) {

	const options = loaderUtils.getOptions(this) || {};

	validateOptions(schema, options, 'ServiceWorker Loader');

	if (!this.webpack) {
		throw new LoaderError({
			name:    'ServiceWorker Loader',
			message: 'This loader is only usable with webpack'
		});
	}

	this.cacheable(false);

	const cb = this.async();
	const filename = loaderUtils.interpolateName(this, options.filename || '[name].js', {
		context: options.context || this.rootContext,
		regExp:  options.regExp
	});
	const publicPath = options.publicPath || '/';
	const outputOptions = {
		filename,
		chunkFilename:      `[id].${filename}`,
		namedChunkFilename: null
	};
	const compiler = this._compilation.createChildCompiler('service-worker', outputOptions);

	// Tapable.apply is deprecated in tapable@1.0.0-x.
	// The plugins should now call apply themselves.
	new WebWorkerTemplatePlugin(outputOptions).apply(compiler);
	new SingleEntryPlugin(this.context, `!!${request}`, 'main').apply(compiler);

	const subCache = `subcache ${__dirname} ${request}`;

	onCompilerHook(compiler, 'compilation', (compilation) => {

		if (compilation.cache) {

			if (!compilation.cache[subCache]) {
				compilation.cache[subCache] = {};
			}

			compilation.cache = compilation.cache[subCache];
		}
	});

	const rootCompiler = this._compiler;
	const fs = rootCompiler.outputFileSystem;
	const unlink = util.promisify(fs.unlink.bind(fs));
	const writeFile = util.promisify(fs.writeFile.bind(fs));

	compiler.runAsChild((err, entries) => {

		if (err) {
			return cb(err);
		}

		if (entries[0]) {

			const file = entries[0].files[0];
			const code = getServiceWorker(
				JSON.stringify(publicPath) || '__webpack_public_path__',
				JSON.stringify(file)
			);

			if (options.outputPath) {
				onCompilerHook(rootCompiler, 'afterEmit', (compilation) => {

					const asset = compilation.assets[file];

					return Promise.all([
						unlink(asset.existsAt),
						writeFile(
							path.join(options.outputPath, file),
							asset.source(),
							'utf8'
						)
					]);
				}, true);
			}

			return cb(null, code);
		}

		return cb(null, null);
	});
}
