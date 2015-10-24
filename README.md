# Airbags

An isomorphic react based generator of sites

## Revamp

**Main goal:** Create a platform for making static isomorphic websites for
capable coders. Don't over simplify. Provide methods of transforming a markup
file (e.g. Markdown) to static HTML through an "arbitrary" React wrapper.

## Components

### Collection

The `collect` module reads data from a supplied file stream, and builds a site
map of the files. It uses *extractors* to extract data from the files, e.g. a
markdown extractor for markdown files. From there on out, the content is HTML.

The end goal for the `collect` module is to provide data for the other modules.

```
collect(content files, extractor) -> data structure with all content, meta data
```

This data structure can then be turned into (new) files containing the data
in some manner.

```
extractor(content file) -> data structure with content, meta data
```

### Manifest/Context

A context or manifest consists of a collected site map, plus some meta data or
configuration for the renderers to use. Examples include site name or header
color.

```
createContext(sitemap, configuration) -> context
```

### Rendering

Renderers take a context, and produce a stream of files as output. Examples are
JSON representations of individual input files, or rendered HTML files. They can
optionally take more parameters.

```
contextRenderer(context) -> stream of one json context representation
jsonRenderer(context) -> stream of json files
reactRenderer(context, react component) -> stream of html files
```

### Context API

The context API provides means of accessing the context data, such as file
names, titles and content. The API needs a *strategy* to access this data,
depending on what means are available for access. Examples include:

 - HTTP access via JSON
 - In-memory access (context already complete)
 - Direct access to stored files

### Helper Components

Provide low-level components and wrappers to display content.


## Todo

 - [x] Add ability to create cache strategy with context
 - [ ] Deprecate initiating API with context in favor of creating cache strategy with context?
 - [x] Deprecate calling strategy methods with context as first argument
 - [ ] Deprecate collection with extraction of HTML in favor of metadata-only?
   - Think about this. We need the metadata. Could lead to only splitting the same functionality.
 - [ ] Remove `getPageHtml` from API and strategies
