# Airbags

An isomorphic react based generator of sites

## Revamp

**Main goal:** Create a platform for making static isomorphic websites for
capable coders. Don't over simplify. Provide methods of transforming a markup
file (e.g. Markdown) to static HTML through an "arbitrary" React wrapper.

## Components

### Content Registration

Provides content both during the transforming phase and for the client side
via an API.

```
content(markdown files) -> data structure readable by API
```

### Transform

Transforms markup files to HTML as a stream.

```
transform(markdown files, React component) -> html files
```

### Helper Components

Provide low-level components and wrappers to display content.
