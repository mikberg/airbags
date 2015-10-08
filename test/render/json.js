import {expect} from 'chai';
import renderJson, {fileFromContext} from '../../src/render/json';
import {Readable} from 'stream';
import File from 'vinyl';

const context = {
  siteMap: {},
  configuration: {},
};

const fileContext = Object.create(context);

fileContext.siteMap = {
  '/test/file': {
    data: {
      html: '<p>contents</p>',
      meta: {},
    },
    originalPath: '/test/file.md',
    nakedPath: '/test/file',
  },
};

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

  it('emits one Vinyl file per file defined in the context', (done) => {
    const stream = renderJson(fileContext);
    let fileCounter = 0;

    stream.on('data', () => fileCounter++);
    stream.on('end', () => {
      expect(fileCounter).to.equal(Object.keys(fileContext.siteMap).length);
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
      expect(JSON.parse(file.contents.toString()).html).to.be.a('string');
    });
    stream.on('end', done);
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
      fileFromContext({ nakedPath: '/cool/file' });
    }).to.throw();
  });

  it('returns a vinyl file', () => {
    expect(File.isVinyl(fileFromContext(fileContext.siteMap['/test/file'])))
        .to.equal(true);
  });

  it('has `nakedPath` with `.json` extension as `path`', () => {
    expect(fileFromContext(fileContext.siteMap['/test/file']).path)
      .to.equal('/test/file.json');
  });

  it('has JSON version of `data` as `content`', () => {
    const {contents} = fileFromContext(fileContext.siteMap['/test/file']);
    expect(JSON.parse(contents.toString()))
        .to.deep.equal(fileContext.siteMap['/test/file'].data);
  });
});
