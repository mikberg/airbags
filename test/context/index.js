import {expect} from 'chai';
import {createContext} from '../../src/context';

describe('createContext', () => {
  it('throws if not given a plausible `siteMap`', () => {
    const fakeMap = {
      a: {},
    };

    expect(() => {
      createContext(fakeMap);
    }).to.throw();
  });

  it('throws if configuration is not an object', () => {
    expect(() => {
      createContext({}, 1);
    }).to.throw();
  });

  it('returns a context containing `siteMap`', () => {
    const siteMap = {};
    expect(createContext(siteMap).siteMap).to.be.an('object');
    expect(createContext(siteMap).siteMap).to.equal(siteMap);
  });

  it('returns a context containing `configuration`', () => {
    expect(createContext({}).configuration).to.be.an('object');
  });
});
