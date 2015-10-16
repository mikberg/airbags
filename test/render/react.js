import {expect} from 'chai';
import React from 'react';
import { Router, Route } from 'react-router';
import {createReactRenderer} from '../../src/render/react';
import {createContext} from '../../src/context';
import {Readable} from 'stream';
import File from 'vinyl';

const App = (props) => {
  return <p>I am app at {props.params.url}</p>;
};

const routes = (
  <Router>
    <Route path="/" component={App} />
  </Router>
);

const context = createContext();

const fileContext = createContext({
  siteMap: {
    '/test/file': {
      data: {
        html: '<p>contents</p>',
        meta: {},
      },
      originalPath: '/test/file.md',
      nakedPath: '/test/file',
    },
  },
});

describe('createReactRenderer', () => {
  it('throws if not given routes', () => {
    expect(() => {
      createReactRenderer();
    }).to.throw();
  });

  it('returns a function', () => {
    expect(createReactRenderer(routes)).to.be.a('function');
  });
});

describe('renderer', () => {
  let renderer;
  beforeEach(() => {
    renderer = createReactRenderer(routes);
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
    let vinylFileCounter = 0;

    stream.on('data', (file) => {
      if (File.isVinyl(file)) {
        vinylFileCounter++;
      }
    });

    stream.on('error', done);

    stream.on('end', () => {
      expect(vinylFileCounter).to.be.greaterThan(0);
      done();
    });
  });

  // it('can emit an error', (done) => {
  //   const stream = renderer(fileContext);
  //   let errored = false;
  //
  //   stream.on('error', () => {
  //     errored = true;
  //   });
  //
  //   stream.on('data', () => {});
  //   stream.on('end', () => {
  //     if (errored) {
  //       return done();
  //     }
  //     done('Did not emit error');
  //   });
  // });
});
