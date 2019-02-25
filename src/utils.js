import { name } from '../package.json';

export const identifier = name;

export function onCompilerHook(compiler, hook, handler, isAsync) {

	if (compiler.hooks) {

		const compilerHook = compiler.hooks[hook];

		if (isAsync) {
			compilerHook.tapPromise(identifier, handler);
		} else {
			compilerHook.tap(identifier, handler);
		}

	} else {

		const kebabHook = hook.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

		compiler.plugin(kebabHook, isAsync ? (compilation, callback) => {

			const result = handler(compilation);

			if (typeof result.then === 'function') {
				result.then(() => callback()).catch(callback);
			}

		} : handler);
	}
}
