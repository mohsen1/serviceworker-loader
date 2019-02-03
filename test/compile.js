import path from 'path';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';

export const fs = new MemoryFs();
export const pathToArtifacts = path.resolve(__dirname, 'artifacts');

export default function compile(fixtureEntry, options = {}, writeToFs = false) {

	const webpackCompiler = webpack({
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
					loader: path.resolve(__dirname, '../src/index.js'),
					options
				}
			}]
		}
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
