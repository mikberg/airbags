import {expect} from 'chai';
import renderJson, {fileFromContext, contextFile} from '../../src/render/json';
import {createContext} from '../../src/context';
import {Readable} from 'stream';
import File from 'vinyl';

const context = createContext();
const fileContext = createContext({
  siteMap: {
    'test/file': {
      data: {
        html: '<p>contents</p>',
        meta: {},
      },
      originalPath: 'test/file.md',
      nakedPath: 'test/file',
    },
  },
});

describe('Render: json', () => {
  it('throws if not given a context', () => {
    expect(() => {
      renderJson({});
    }).to.throw();
  });

  it('returns a readable stream in object mode', () => {
    const stream = renderJson(context);
    expect(stream instanceof Readable).to.equal(true);
    expect(stream._readableState.objectMode).to.equal(true);
  });

  it('emits one Vinyl file per file defined in the context + 1', (done) => {
    const stream = renderJson(fileContext);
    let fileCounter = 0;

    stream.on('data', () => fileCounter++);
    stream.on('end', () => {
      expect(fileCounter - 1).to.equal(Object.keys(fileContext.getSiteMap()).length);
      done();
    });
  });

  it('emits Vinyl files', (done) => {
    const stream = renderJson(fileContext);

    stream.on('data', (file) => {
      expect(File.isVinyl(file)).to.equal(true);
    });
    stream.on('end', done);
  });

  it('emits JSON Vinyl files', (done) => {
    const stream = renderJson(fileContext);

    stream.on('data', (file) => {
      expect(() => {
        JSON.parse(file.contents.toString());
      }).not.to.throw();
    });
    stream.on('end', done);
  });

  it('emits a `context.json`', (done) => {
    const stream = renderJson(fileContext);
    const paths = [];

    stream.on('data', (file) => {
      paths.push(file.path);
    });
    stream.on('end', () => {
      expect(paths).to.contain('context.json');
      done();
    });
  });
});

describe('fileFromContext', () => {
  it('throws if file doesn\'t have a `nakedPath`', () => {
    expect(() => {
      fileFromContext({});
    }).to.throw();
  });

  it('throws if file doesn\'t have `data` object', () => {
    expect(() => {
      fileFromContext({ nakedPath: 'cool/file' });
    }).to.throw();
  });

  it('returns a vinyl file', () => {
    expect(File.isVinyl(fileFromContext(fileContext.getSiteMap()['test/file'])))
        .to.equal(true);
  });

  it('has `nakedPath` with `.json` extension as `path`', () => {
    expect(fileFromContext(fileContext.getSiteMap()['test/file']).path)
      .to.equal('test/file.json');
  });

  it('has JSON version of `data` as `content`', () => {
    const {contents} = fileFromContext(fileContext.getSiteMap()['test/file']);
    expect(JSON.parse(contents.toString()))
        .to.deep.equal(fileContext.getSiteMap()['test/file'].data);
  });
});

describe('contextFile', () => {
  it('returns a vinyl file', () => {
    expect(File.isVinyl(contextFile(fileContext))).to.equal(true);
  });

  it('contains the context data', () => {
    expect(contextFile(fileContext).contents.toString())
      .to.deep.equal(JSON.stringify(fileContext));
  });
});
