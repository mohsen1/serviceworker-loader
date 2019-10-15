# service-worker-loader

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Peer dependencies status][peer-deps]][peer-deps-url]
[![Dependencies status][deps]][deps-url]
[![Build status][build]][build-url]
[![Dependabot badge][dependabot]][dependabot-url]

[npm]: https://img.shields.io/npm/v/service-worker-loader.svg
[npm-url]: https://npmjs.com/package/service-worker-loader

[node]: https://img.shields.io/node/v/service-worker-loader.svg
[node-url]: https://nodejs.org

[peer-deps]: https://david-dm.org/mohsen1/service-worker-loader/peer-status.svg
[peer-deps-url]: https://david-dm.org/mohsen1/service-worker-loader?type=peer

[deps]: https://david-dm.org/mohsen1/service-worker-loader.svg
[deps-url]: https://david-dm.org/mohsen1/service-worker-loader

[build]: http://img.shields.io/travis/mohsen1/service-worker-loader/master.svg
[build-url]: https://travis-ci.org/mohsen1/service-worker-loader

[dependabot]: https://api.dependabot.com/badges/status?host=github&repo=mohsen1/service-worker-loader
[dependabot-url]: https://dependabot.com/

Modern ServiceWorker loader for [Webpack](https://webpack.js.org): takes a file, emits it separately from the bundle, and exports a function to register the file as a service worker.

## Install

```sh
npm i -D service-worker-loader
# or
yarn add -D service-worker-loader
```

## [Usage](https://webpack.js.org/concepts/loaders)

```js
import registerServiceWorker, {
    ServiceWorkerNoSupportError
} from 'service-worker-loader!./sw';

registerServiceWorker({ scope: '/' }).then((registration) => {
    console.log('Success!');
    console.log(registration);
}).catch((err) => {

    if (err instanceof ServiceWorkerNoSupportError) {
        console.log('ServiceWorker is not supported.');
    } else {
        console.log('Error!');
    }
});
```

Example with [Workbox Window](https://developers.google.com/web/tools/workbox/modules/workbox-window):

```js
import {
    Workbox
} from 'workbox-window';
import {
    scriptUrl
} from 'service-worker-loader!./sw';

if ('serviceWorker' in navigator) {

    const wb = new Workbox(scriptUrl);

    wb.register();
}
```

## API

### Loader exports

```js
import registerServiceWorker, { scriptUrl, ServiceWorkerNoSupportError } from 'service-worker-loader!./service-worker.js';
```

* `registerServiceWorker(options: RegistrationOptions): Promise<ServiceWorkerRegistration>` registers the file passed through the loader as a service worker. The `options` argument is passed as the second argument to [`navigator.serviceWorker.register`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register). The return value is a promise to [a `ServiceWorkerRegistration` object](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration).

* `scriptUrl: string` is the URL of the emitted service worker file

* `class ServiceWorkerNoSupportError extends Error` is the error type that `registerServiceWorker` rejects with when the browser doesn’t support service workers

### Loader options

#### `filename`

Defaults to `"[name].js"`. Specify the file name for generated ServiceWorker file

#### `publicPath`

Defaults to `"/"`. Overrides default `publicPath`. 

#### `outputPath`

Overrides output path for all ServiceWorkers.

## Hot Module Replacement

Webpack's HMR did not designed for ServiceWorkers, so need to disable HMR for ServiceWorkers. You can do it with [`hmr-filter-webpack-plugin` plugin](https://github.com/TrigenSoftware/hmr-filter-webpack-plugin#usage).

## Using with TypeScript

Add it to your `globals.d.ts`:

```ts
declare module 'service-worker-loader!*' {
    const register: import('service-worker-loader/types').ServiceWorkerRegister;
    const scriptUrl: import('service-worker-loader/types').ScriptUrl;
    const ServiceWorkerNoSupportError: import('service-worker-loader/types').ServiceWorkerNoSupportError;
    export default register;
    export {
        scriptUrl,
        ServiceWorkerNoSupportError
    };
}
// or, for example
declare module '*?sw' {
    // ...
}
```

Now you can import ServiceWorker:

```ts
import registerServiceWorker from 'service-worker-loader!./serviceWorker';
// or
import registerServiceWorker from './serviceWorker?sw';
```

## Credit

This loader is based almost entirely on [worker-loader](https://github.com/webpack/worker-loader) by [@sokra](https://github.com/sokra).

## License

MIT
