import {expect} from 'chai';
import sinon from 'sinon';
import Stream from 'stream';
import collect, {extractFromFile} from '../../src/collect';
import File from 'vinyl';

const createFileStream = () => {
  return new Stream.Readable({ objectMode: true });
};

const extractor = (fileContents) => ({
  meta: { title: 'test' },
  content: fileContents
});

describe('collect', () => {
  it('throws if not given a readable stream', () => {
    let fileStream = new Stream.Writable();
    expect(() => collect(fileStream, extractor)).to.throw();
  });

  it('throws if not given an extractor', () => {
    expect(() => collect(createFileStream(), 'notextractor')).to.throw();
  });

  it('rejects if given a non-vinyl-file object', (done) => {
    let fileStream = createFileStream();
    fileStream.push('hei');
    fileStream.push(null);

    collect(fileStream, extractor)
      .then(() => done(true))
      .catch((err) => {
        expect(err.message).to.contain('vinyl');
        done();
      });
  });

  it('returns a promise', () => {
    let promise = collect(createFileStream(), extractor);
    expect(promise.then).to.be.a('function');
  });

  it('resolves to object with siteMap of pages', (done) => {
    let fileStream = createFileStream();

    fileStream.push(new File({
      cwd: '/',
      base: '/test/',
      path: '/test/article.md',
      contents: new Buffer('hello')
    }));

    fileStream.push(null);

    collect(fileStream, extractor)
      .then((siteMap) => {
        expect(siteMap).to.deep.equal({
          '/test/article.md': {
            meta: {
              title: 'test'
            },
            content: 'hello'
          }
        });
        done();
      })
      .catch(done);
  });
});

describe('extractFromFile', () => {
  it('throws if given non-vinyl-file object', () => {
    expect(() => extractFromFile({}, extractor)).to.throw();
  });

  it('calls extractor with file contents', () => {
    let contents = 'test';
    let spy = sinon.spy(extractor);
    let file = new File({ contents: new Buffer(contents) });

    extractFromFile(file, spy);

    expect(spy.calledWith(contents)).to.equal(true);
  });
});
