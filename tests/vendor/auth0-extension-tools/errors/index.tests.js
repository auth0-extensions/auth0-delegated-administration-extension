import { expect } from 'chai';

import extensionTools from '../../../../vendor/auth0-extension-tools';


describe('vendor/auth0-extension-tools/errors', () => {
  it('should expose all errors', () => {
    expect(extensionTools.ArgumentError).to.be.ok;
    expect(extensionTools.ForbiddenError).to.be.ok;
    expect(extensionTools.HookTokenError).to.be.ok;
    expect(extensionTools.ManagementApiError).to.be.ok;
    expect(extensionTools.NotFoundError).to.be.ok;
    expect(extensionTools.UnauthorizedError).to.be.ok;
    expect(extensionTools.ValidationError).to.be.ok;
  });
});
