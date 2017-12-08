import { expect } from 'chai';
import _ from 'lodash';

import config from '../../../server/lib/config';
import { defaultConfig } from '../../utils/dummyData';


describe('config', () => {
  describe('#get', () => {
    it('should return setting from provider if configured', () => {
      config.setProvider((key) => defaultConfig[key], null);

      expect(config('AUTH0_DOMAIN')).to.equal(defaultConfig.AUTH0_DOMAIN);
    });

    it('should use domain for issuer domain if none defined', () => {
      config.setProvider((key) => defaultConfig[key], null);

      expect(config('AUTH0_ISSUER_DOMAIN')).to.equal(defaultConfig.AUTH0_DOMAIN);
    });

    it('should use issuer if defined', () => {
      const issuerConfig = _.cloneDeep(defaultConfig);
      issuerConfig.AUTH0_ISSUER_DOMAIN = 'some_domain';

      config.setProvider((key) => issuerConfig[key], null);

      expect(config('AUTH0_DOMAIN')).to.equal(defaultConfig.AUTH0_DOMAIN);
      expect(config('AUTH0_ISSUER_DOMAIN')).to.equal(issuerConfig.AUTH0_ISSUER_DOMAIN);

      // Put provider back or other tests fail!
      config.setProvider((key) => defaultConfig[key], null);
    });

    it('test getValue and setValue', () => {
      config.setProvider((key) => defaultConfig[key], null);

      expect(config.setValue('SOME_KEY', 'something else')).to.not.throw;
      expect(config.getValue('SOME_KEY')).to.equal('something else');
    });

  });
});
