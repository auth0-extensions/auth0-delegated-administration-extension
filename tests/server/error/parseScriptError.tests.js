import { expect } from 'chai';
import { ValidationError } from 'auth0-extension-tools';

import parseScriptError from '../../../server/lib/errors/parseScriptError';


describe('server/error/parseScriptError', () => {
  describe('#branches', () => {
    it('should handle bad error objects', () => {
      const targetError = new ValidationError('');
      targetError.stack = 'someError-script error';
      expect(parseScriptError({}, 'someError')).to.deep.equal(targetError);
    });
  });
});
