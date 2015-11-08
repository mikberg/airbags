import mergeStream from 'merge-stream';
import vinylFs from 'vinyl-fs';
import collect from '../collect';
import markdownExtractor from '../extractors/markdown';
import createContext from '../context';

export default class AirbagsPlugin {
  constructor(options) {
    this.options = options;
  }

  getSource(options) {
    const sourceFiles = options.sourceFiles || [];
    // TODO: Replace process.cwd with something from webpack?
    return vinylFs.src(sourceFiles, { base: process.cwd() });
  }

  getExtractor(options) {
    return options.extractor || markdownExtractor;
  }

  getAdditionalPages(options) {
    const additional = options.additionalPages || {};
    const siteMap = {};

    Object.keys(additional).forEach((nakedPath) => {
      const data = additional[nakedPath];
      siteMap[nakedPath] = {
        nakedPath,
        originalPath: `${nakedPath}.html`,
        data,
      };
    });

    return siteMap;
  }

  getApi(options) {
    if (!options.api) {
      throw new Error('Needs an API to be supplied in options');
    }
    return options.api;
  }

  getRenderers(options) {
    return options.renderers || [];
  }

  emit(compilation, done) {
    const source = this.getSource(this.options);
    const extractor = this.getExtractor(this.options);

    collect(source, extractor).then(siteMap => {
      Object.assign(siteMap, this.getAdditionalPages(this.options));
      const context = createContext({ siteMap });
      const api = this.getApi(this.options);

      if (!api.strategies.cacheStrategy) {
        throw new Error(`AirbagsPlugin needs cacheStrategy to be available on server`);
      }

      // Inject the context
      api.strategies.cacheStrategy.context = context;

      const renderers = this.getRenderers(this.options);

      mergeStream(...renderers.map(renderer => renderer(api)))
      .on('data', (file) => {
        compilation.fileDependencies.push(file.history[0]);
        compilation.assets[file.path] = {
          source: () => file.contents.toString(),
          size: () => file.contents.toString().length,
        };
      })
      .on('error', error => done(error))
      .on('end', () => {
        done();
      });
    });
  }

  apply(compiler) {
    compiler.plugin('emit', this.emit.bind(this));
  }
}
