import { expect } from 'chai';
import sinon from 'sinon';
import Stream from 'stream';
import File from 'vinyl';
import collect from '../../src/collect';
import isSiteMapOk from '../../src/collect/isSiteMapOk';

const createFileStream = () => {
  return new Stream.Readable({ objectMode: true });
};

describe('isSiteMapOk', () => {
  it('returns true for empty generated siteMap', (done) => {
    const fileStream = createFileStream();

    fileStream.push(null);

    collect(fileStream, sinon.stub().returns({}))
      .then((siteMap) => {
        expect(isSiteMapOk(siteMap)).to.equal(true);
        done();
      })
      .catch(done);
  });

  it('returns true for filled generated siteMap', (done) => {
    const fileStream = createFileStream();

    fileStream.push(new File({
      path: 'cool/file.md',
      contents: new Buffer('hello'),
    }));

    fileStream.push(null);

    collect(fileStream, sinon.stub().returns({}))
      .then((siteMap) => {
        expect(isSiteMapOk(siteMap)).to.equal(true);
        done();
      })
      .catch(done);
  });

  it('returns false for implausible siteMap', () => {
    expect(isSiteMapOk({a: 'b'})).to.equal(false);
  });
});
