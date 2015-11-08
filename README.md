# Airbags

Create ~~isomorphic~~ universal static websites, using an uniform API when
generating and on the client side.

See [example in docs](https://github.com/mikberg/airbags/tree/develop/docs)

[![Build Status](https://travis-ci.org/mikberg/airbags.svg?branch=develop)](https://travis-ci.org/mikberg/airbags) [![Coverage Status](https://coveralls.io/repos/mikberg/airbags/badge.svg?branch=develop&service=github)](https://coveralls.io/github/mikberg/airbags?branch=develop)
---

## Plain Usage

### Collecting

Collect pages using the `collect` function, which takes a stream of *vinyl* files and an *extractor*, e.g. the markdown extractor. Extractors are functions which takes a string and returns an object with the shape

```js
{
  html: `<string of html>`,
  meta: {
    `<meta data from file>`
  }
}
```

`collect` generates a `siteMap` object:

```js
collect(source, extractor).then(siteMap => console.log(siteMap));
```

### Context

The context contains information which should be available both when generating static pages and during runtime on the client side. Create a context using `createContext`.

```js
const context = createContext({ siteMap });
```

### Context API

The context API lets us access data, and consists of two main parts: the *strategies* and the *middleware*.

**Strategies** define how to access the context data. **Middleware** can extend the context and the API: they can modify the context or add methods to the API.

```js
import createApi, { createHttpStrategy } from 'airbags/api';
import { home, menu, config } from 'airbags/middleware';

const middleware = {
  home(), // A page with `home: true` in meta data will be renamed `index`
  menu(), // Add a method `.getMenu()` to API, which returns pages with `inMenu: true` in meta data
  config({ siteName: 'My Awesome Site' }), // Add a method `getConfig()` to API, which returns the supplied object
};

const api = createApi([createHttpStrategy('/')], middleware);
```

When rendering, you probably want to use the cache strategy instead of the HTTP strategy. The cache strategy factory `createCacheStrategy`, takes an optional context, or the context can be set later with the `setContext` method.

### Render

Renderers take an API instance and returns a stream of `vinyl` files. This package contains two renderers, the `json` renderer and renderer suitable for use with React, `reactRenderer`.

```js
const renderers = [
  renderJson,
  createReactRenderer(renderPath), // `renderPath` is a function `nakedPath` -> Promise<string of html>
];

mergeStream(...renderers.map(renderer => renderer(api)))
  .on('data', file => {
    // Store the file
  })
  .on('end', console.log('Rendered successfully!'));
```

## Todo

 - [ ] Support hot reloading of content
 - [ ] Support style loaders in generating phase
