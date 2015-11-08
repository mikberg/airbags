import {expect} from 'chai';
import config from '../../src/middleware/config';
import createContext from '../../src/context';
import createApi from '../../src/api';
import createCacheStrategy from '../../src/api/cache';

describe('config middleware', () => {
  describe('create', () => {
    it('throws if config object is not an object', () => {
      expect(() => {
        config(2);
      }).to.throw();
    });

    it('returns a function', () => {
      expect(config({})).to.be.a('function');
    });
  });

  describe('config', () => {
    it('attaches config from createConfig to api', (done) => {
      const configObject = { test: 'cool' };
      const context = createContext();
      const api = createApi(
        [ createCacheStrategy(context) ],
        [ config(configObject) ]
      );

      api.getContext().then(cont => {
        expect(cont.config).to.deep.equal(configObject);
        done();
      }).catch(done);
    });

    it('adds method `getConfig` to api', () => {
      const api = {};
      const conf = config({});

      conf.call(api);

      expect(api.getConfig).to.be.a('function');
    });
  });

  describe('getConfig', () => {
    it('returns config based on strategy', (done) => {
      const context = createContext({ siteMap: {}, config: { siteName: 'test' } });
      const api = createApi([createCacheStrategy(context)], [config()]);

      api.getConfig().then((conf) => {
        expect(conf.siteName).to.equal('test');
        done();
      }).catch(done);
    });
  });
});
