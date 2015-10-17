import {expect} from 'chai';
import sinon from 'sinon';
import {createReactRenderer} from '../../src/render/react';
import {createContext} from '../../src/context';
import {Readable} from 'stream';
import File from 'vinyl';

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

const resolvingPromise = new Promise((resolve) => resolve('file contents'));
const rejectingPromise = new Promise((resolve, reject) => reject(new Error('error here')));

describe('createReactRenderer', () => {
  it('throws if not given a function', () => {
    expect(() => {
      createReactRenderer();
    }).to.throw();
  });

  it('returns a function', () => {
    expect(createReactRenderer(() => {})).to.be.a('function');
  });
});

describe('renderer', () => {
  it('throws if not given a context', () => {
    const renderer = createReactRenderer(() => {});
    expect(() => {
      renderer();
    }).to.throw();
  });

  it('returns a stream', () => {
    const renderer = createReactRenderer(() => {});
    expect(renderer(fileContext)).to.be.instanceof(Readable);
  });

  it('emits vinyl files', (done) => {
    const renderer = createReactRenderer(sinon.stub().returns(resolvingPromise));
    const stream = renderer(fileContext);
    let vinylFileCounter = 0;

    stream.on('data', (file) => {
      if (File.isVinyl(file)) {
        vinylFileCounter++;
      }
    });

    stream.on('end', () => {
      expect(vinylFileCounter).to.be.greaterThan(0);
      done();
    });
  });

  it('emits files with contents from `renderPath`', (done) => {
    const renderer = createReactRenderer(sinon.stub().returns(resolvingPromise));
    const stream = renderer(fileContext);

    stream.on('data', (file) => {
      expect(file.contents.toString()).to.equal('file contents');
    });

    stream.on('end', () => {
      done();
    });
  });

  it('emits files with path from `nakedPath`', (done) => {
    const renderer = createReactRenderer(sinon.stub().returns(resolvingPromise));
    const stream = renderer(fileContext);

    stream.on('data', (file) => {
      expect(file.path).to.equal('/test/file.html');
    });

    stream.on('end', () => {
      done();
    });
  });

  it('emits error if `renderPath` rejects', (done) => {
    const renderer = createReactRenderer(sinon.stub().returns(rejectingPromise));
    const stream = renderer(fileContext);

    stream.on('error', () => {
      done();
    });

    stream.on('data', () => {});
  });

  it('calls `renderPath` nakedPath', (done) => {
    const renderPath = sinon.stub().returns(resolvingPromise);
    const renderer = createReactRenderer(renderPath);
    const stream = renderer(fileContext);

    stream.on('data', () => {});
    stream.on('end', () => {
      expect(renderPath.calledWith('test/file')).to.equal(true);
      done();
    });
  });

  it('emits error if `renderPath` doesn\'t return promise', (done) => {
    const renderer = createReactRenderer(() => {});
    const stream = renderer(fileContext);

    stream.on('data', () => {});
    stream.on('error', () => {
      done();
    });
  });

  it('emits error if `renderPath` doesn\'t resolve to string', (done) => {
    const stub = sinon.stub().returns(new Promise((resolve) => {
      resolve(42);
    }));
    const renderer = createReactRenderer(stub);
    const stream = renderer(fileContext);

    stream.on('data', () => {});
    stream.on('error', () => {
      done();
    });
  });
});
