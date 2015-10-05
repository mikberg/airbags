# Airbags

An isomorphic react based generator of sites

## Revamp

**Main goal:** Create a platform for making static isomorphic websites for
capable coders. Don't over simplify. Provide methods of transforming a markup
file (e.g. Markdown) to static HTML through an "arbitrary" React wrapper.

## Components

### Collection

Provides content both during the transforming phase and for the client side
via an API.

```
collect(content files) -> data structure with all content, meta data
```

This data structure can then be turned into (new) files containing the data
in some manner.

The exact manner in which the collection phase extracts content is done by an
extractor:

```
extractor(content file) -> data structure with content, meta data
```

### Transform

Transforms markup files to HTML as a stream.

```
transform(markdown files, React component) -> html files
```

### Helper Components

Provide low-level components and wrappers to display content.
