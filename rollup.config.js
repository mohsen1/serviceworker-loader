import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { eslint } from 'rollup-plugin-eslint';
import pkg from './package.json';

const plugins = [
	eslint({
		exclude:      ['**/*.json', 'node_modules/**'],
		throwOnError: process.env.ROLLUP_WATCH != 'true'
	}),
	json({
		preferConst: true
	}),
	commonjs(),
	babel({
		runtimeHelpers: true
	})
];
const dependencies = [].concat(
	['path'],
	Object.keys(pkg.dependencies),
	Object.keys(pkg.peerDependencies)
);

function external(id) {
	return dependencies.some(_ =>
		_ == id || id.indexOf(`${_}/`) == 0
	);
}

export default {
	input:  'src/index.js',
	watch:  {
		include: 'src/**/*.js'
	},
	plugins,
	external,
	output: {
		file:      pkg.main,
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
};
