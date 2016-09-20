import { expect } from 'chai';

import config from '../../../server/lib/config';
import { defaultConfig } from '../../utils/dummyData';


describe('config', () => {
  describe('#get', () => {
    it('should return setting from provider if configured', () => {
      config.setProvider((key) => defaultConfig[key], null);

      expect(config('AUTH0_DOMAIN')).to.equal(defaultConfig.AUTH0_DOMAIN);
    });
  });
});
