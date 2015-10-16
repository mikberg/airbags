import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';
import {Router, Route} from 'react-router';
import {createReactRenderer, renderPath} from '../../src/render/react';
import {createContext} from '../../src/context';
import AirbagsApi from '../../src/api';
import CacheStrategy from '../../src/api/cache';
import {Readable} from 'stream';
import File from 'vinyl';

const App = (props) => {
  return <p>I am app at {props.params.url}</p>;
};

const routes = (
  <Router>
    <Route path="/index.html" component={App} />
  </Router>
);

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

const api = new AirbagsApi(fileContext, [new CacheStrategy()]);

const resolvingPromise = new Promise((resolve) => resolve('file contents'));
const rejectingPromise = new Promise((resolve, reject) => reject(new Error('error here')));

describe('createReactRenderer', () => {
  it('throws if not given routes', () => {
    expect(() => {
      createReactRenderer(undefined, api);
    }).to.throw();
  });

  it('throws if not given api', () => {
    expect(() =>{
      createReactRenderer(routes);
    }).to.throw();
  });

  it('returns a function', () => {
    expect(createReactRenderer(routes, api)).to.be.a('function');
  });
});

describe('renderer', () => {
  let renderer;
  beforeEach(() => {
    renderer = createReactRenderer(routes, api);
  });

  it('throws if not given a context', () => {
    expect(() => {
      renderer();
    }).to.throw();
  });

  it('returns a stream', () => {
    expect(renderer(fileContext)).to.be.instanceof(Readable);
  });

  it('emits vinyl files', (done) => {
    const stream = renderer(fileContext);
    sinon.stub(stream, 'renderPath').returns(resolvingPromise);
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
    const stream = renderer(fileContext);
    sinon.stub(stream, 'renderPath').returns(resolvingPromise);

    stream.on('data', (file) => {
      expect(file.contents.toString()).to.equal('file contents');
    });

    stream.on('end', () => {
      done();
    });
  });

  it('emits error if `renderPath` rejects', (done) => {
    const stream = renderer(fileContext);
    sinon.stub(stream, 'renderPath').returns(rejectingPromise);

    stream.on('error', () => {
      done();
    });

    stream.on('data', () => {});
  });

  it('calls `renderPath` with routes, nakedPath, api and context', (done) => {
    const stream = renderer(fileContext);
    sinon.stub(stream, 'renderPath').returns(resolvingPromise);

    stream.on('data', () => {});
    stream.on('end', () => {
      const [_routes, nakedPath, _api, context] = stream.renderPath.getCall(0).args;
      expect(_routes).to.equal(routes);
      expect(nakedPath).to.equal('test/file');
      expect(_api).to.be.an('object');
      expect(context).to.be.an('object');
      done();
    });
  });
});

describe('renderPath', () => {
  it('returns a promise', () => {
    expect(renderPath(routes, '/', {}, context)).to.be.instanceof(Promise);
  });

  it('rejects if given non-existing nakedPath', (done) => {
    renderPath(routes, '/non-existing', {}, context)
      .then(() => {
        done('promise resolved');
      })
      .catch(() => {
        done();
      });
  });

  it('resolves to rendered string', (done) => {
    renderPath(routes, 'index', api, context)
      .then((rendered) => {
        expect(rendered).to.be.a('string');
        expect(rendered).to.contain('I am app');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
