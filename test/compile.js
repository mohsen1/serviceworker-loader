import path from 'path';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';

export const fs = new MemoryFs();
export const pathToArtifacts = path.resolve(__dirname, 'artifacts');
const defaultOptions = {
	plugins: []
};

export default function compile(fixtureEntry, options = defaultOptions, writeToFs = false) {

	const {
		devMode,
		plugins,
		...loaderOptions
	} = options;
	const webpackCompiler = webpack({
		...(devMode ? {
			mode:    'development',
			devtool: 'inline-source-map'
		} : {}),
		optimization: {
			minimize: false
		},
		context: __dirname,
		entry:   `./${fixtureEntry}`,
		output:  {
			path:     pathToArtifacts,
			filename: 'bundle.js'
		},
		module:  {
			rules: [{
				test: /serviceWorker\.js$/,
				use:  {
					loader:  path.resolve(__dirname, '../src/index.js'),
					options: loaderOptions
				}
			}]
		},
		plugins
	});

	if (!writeToFs) {
		webpackCompiler.outputFileSystem = fs;
	}

	return new Promise((resolve, reject) => {

		webpackCompiler.run((err, stats) => {

			const hasErrors = stats && stats.hasErrors();

			if (err || hasErrors) {
				reject(hasErrors
					? new Error(stats.toJson().errors[0])
					: err
				);
				return;
			}

			resolve(stats.toJson());
		});
	});
}
