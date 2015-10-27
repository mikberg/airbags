import {expect} from 'chai';
import renderJson, {fileFromData, contextFile} from '../../src/render/json';
import {createContext} from '../../src/context';
import createApi from '../../src/api';
import createCacheStrategy from '../../src/api/cache';
import {Readable} from 'stream';
import File from 'vinyl';

// const context = createContext();
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
const api = createApi([createCacheStrategy(fileContext)]);

describe('Render: json', () => {
  it('throws if not given an api', () => {
    expect(() => {
      renderJson({});
    }).to.throw();
  });

  it('returns a readable stream in object mode', () => {
    const stream = renderJson(api);
    expect(stream instanceof Readable).to.equal(true);
    expect(stream._readableState.objectMode).to.equal(true);
  });

  it('emits one Vinyl file per file defined in the context + 1', (done) => {
    const stream = renderJson(api);
    let fileCounter = 0;

    stream.on('data', () => fileCounter++);
    stream.on('error', done);
    stream.on('end', () => {
      expect(fileCounter - 1).to.equal(Object.keys(fileContext.getSiteMap()).length);
      done();
    });
  });

  it('emits Vinyl files', (done) => {
    const stream = renderJson(api);

    stream.on('data', (file) => {
      expect(File.isVinyl(file)).to.equal(true);
    });
    stream.on('end', done);
  });

  it('emits JSON Vinyl files', (done) => {
    const stream = renderJson(api);

    stream.on('data', (file) => {
      expect(() => {
        JSON.parse(file.contents.toString());
      }).not.to.throw();
    });
    stream.on('end', done);
  });

  it('emits a `context.json`', (done) => {
    const stream = renderJson(api);
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

describe('fileFromData', () => {
  it('throws if not given a `nakedPath`', () => {
    expect(() => {
      fileFromData();
    }).to.throw();
  });

  it('throws if not given a data object', () => {
    expect(() => {
      fileFromData('cool/file');
    }).to.throw();
  });

  it('returns a vinyl file', () => {
    expect(File.isVinyl(
      fileFromData('test/file', fileContext.getSiteMap()['test/file'].data)
    )).to.equal(true);
  });

  it('has `nakedPath` with `.json` extension as `path`', () => {
    expect(
      fileFromData('test/file', fileContext.getSiteMap()['test/file']).path
    ).to.equal('test/file.json');
  });

  it('has JSON version of `data` as `content`', () => {
    const {contents} = fileFromData('test/file', fileContext.getSiteMap()['test/file'].data);
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
