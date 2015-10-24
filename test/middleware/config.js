import {expect} from 'chai';
import createConfig from '../../src/middleware/config';
import {createContext} from '../../src/context';
import createApi from '../../src/api';
import createCacheStrategy from '../../src/api/cache';

describe('config middleware', () => {
  describe('createConfig', () => {
    it('throws if config object is not an object', () => {
      expect(() => {
        createConfig(2);
      }).to.throw();
    });

    it('returns a function', () => {
      expect(createConfig({})).to.be.a('function');
    });
  });

  describe('config', () => {
    it('attaches config from createConfig to api', () => {
      const api = {};
      const configObject = { test: 'cool' };
      const config = createConfig(configObject);

      config.call(api);

      expect(api.context.config).to.deep.equal(configObject);
    });

    it('adds method `getConfig` to api', () => {
      const api = {};
      const config = createConfig({});

      config.call(api);

      expect(api.getConfig).to.be.a('function');
    });
  });

  describe('getConfig', () => {
    it('returns config based on strategy', (done) => {
      const context = createContext({ siteMap: {}, config: { siteName: 'test' } });
      const api = createApi([createCacheStrategy(context)], [createConfig()]);

      api.getConfig().then((config) => {
        expect(config.siteName).to.equal('test');
        done();
      }).catch(done);
    });
  });
});
