# service-worker-loader

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Peer dependency status][peer-deps]][peer-deps-url]
[![Dependency status][deps]][deps-url]
[![Build status][build]][build-url]

[npm]: https://img.shields.io/npm/v/service-worker-loader.svg
[npm-url]: https://www.npmjs.com/package/service-worker-loader

[node]: https://img.shields.io/node/v/service-worker-loader.svg
[node-url]: https://nodejs.org

[peer-deps]: https://img.shields.io/david/peer/mohsen1/service-worker-loader.svg
[peer-deps-url]: https://david-dm.org/mohsen1/service-worker-loader?type=peer

[deps]: https://img.shields.io/david/mohsen1/service-worker-loader.svg
[deps-url]: https://david-dm.org/mohsen1/service-worker-loader

[build]: http://img.shields.io/travis/mohsen1/service-worker-loader.svg
[build-url]: https://travis-ci.org/mohsen1/service-worker-loader

Modern ServiceWorker loader for [Webpack](https://webpack.js.org).

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

registerServiceWorker({ scope: '/' }).then(() => {
    console.log('Success!');
}).catch((err) => {

    if (err instanceof ServiceWorkerNoSupportError) {
        console.log('ServiceWorker is not supported.');
    } else {
        console.log('Error!');
    }
});
```

### Options

#### `filename`
Defaults to `"[name].js"`. Specify the file name for generated Service Worker file

#### `publicPath`
Defaults to `"/"`. Overrides default `publicPath`. 

#### `outputPath`
Overrides output path for all ServiceWorkers.

## Credit

This loader is based almost entirely on [worker-loader](https://github.com/webpack/worker-loader) by [@sokra](https://github.com/sokra).

## License

MIT

---
[![NPM](https://nodei.co/npm/service-worker-loader.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/service-worker-loader/)
