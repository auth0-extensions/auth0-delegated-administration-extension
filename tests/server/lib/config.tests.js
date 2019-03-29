import { expect } from 'chai';
import _ from 'lodash';

import config from '../../../server/lib/config';
import { defaultConfig } from '../../utils/dummyData';


describe('config', () => {
  describe('#get', () => {
    it('should return setting from provider if configured', () => {
      config.setProvider(key => defaultConfig[key], null);

      expect(config('AUTH0_DOMAIN')).to.equal(defaultConfig.AUTH0_DOMAIN);
    });

    it('should use domain for custom domain if none defined', () => {
      config.setProvider(key => defaultConfig[key], null);

      expect(config('AUTH0_CUSTOM_DOMAIN')).to.equal(defaultConfig.AUTH0_DOMAIN);
    });

    it('should use issuer if defined', () => {
      const issuerConfig = _.cloneDeep(defaultConfig);
      issuerConfig.AUTH0_CUSTOM_DOMAIN = 'some_domain';

      config.setProvider(key => issuerConfig[key], null);

      expect(config('AUTH0_DOMAIN')).to.equal(defaultConfig.AUTH0_DOMAIN);
      expect(config('AUTH0_CUSTOM_DOMAIN')).to.equal(issuerConfig.AUTH0_CUSTOM_DOMAIN);

      // Put provider back or other tests fail!
      config.setProvider(key => defaultConfig[key], null);
    });

    it('should detect appliance', () => {
      const issuerConfig = _.cloneDeep(defaultConfig);
      issuerConfig.AUTH0_RTA = 'example.com';

      config.setProvider(key => issuerConfig[key], null);

      expect(config('IS_APPLIANCE')).to.equal(true);

      // Put provider back or other tests fail!
      config.setProvider(key => defaultConfig[key], null);
    });

    it('should detect non-appliance', () => {
      const issuerConfig = _.cloneDeep(defaultConfig);
      issuerConfig.AUTH0_RTA = 'auth0.auth0.com';

      config.setProvider(key => issuerConfig[key], null);

      expect(config('IS_APPLIANCE')).to.equal(false);

      // Put provider back or other tests fail!
      config.setProvider(key => defaultConfig[key], null);
    });

    it('test getValue and setValue', () => {
      config.setProvider(key => defaultConfig[key], null);

      expect(config.setValue('SOME_KEY', 'something else')).to.not.throw; // eslint-disable-line no-unused-expressions
      expect(config.getValue('SOME_KEY')).to.equal('something else');
    });

  });
});
