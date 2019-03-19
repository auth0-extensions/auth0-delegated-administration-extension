import { expect } from 'chai';

import getScopes from '../../../server/lib/getScopes';
import * as constants from '../../../server/constants';

const admins = {
  meta: {
    app_metadata: {
      roles: constants.ADMIN_ROLE_NAME
    }
  },
  role: {
    roles: constants.ADMIN_ROLE_NAME
  },
  auth: {
    app_metadata: {
      authorization: {
        roles: constants.ADMIN_ROLE_NAME
      }
    }
  },
  claim: {
    'https://example.com/auth0-delegated-admin': {
      roles: constants.ADMIN_ROLE_NAME
    }
  }
};

const adminScopes = [ constants.AUDITOR_PERMISSION, constants.USER_PERMISSION, constants.LOGSUSER_PERMISSION, constants.ADMIN_PERMISSION ];


describe('getScopes', () => {
  it('should get scopes from app_metadata', () => {
    expect(getScopes(admins.meta)).to.eql(adminScopes);
  });

  it('should get scopes from user.roles', () => {
    expect(getScopes(admins.role)).to.eql(adminScopes);
  });

  it('should get scopes from app_metadata.authorization', () => {
    expect(getScopes(admins.auth)).to.eql(adminScopes);
  });

  it('should get scopes from namespaces claims', () => {
    expect(getScopes(admins.claim)).to.eql(adminScopes);
  });

  it('should get no scopes', () => {
    expect(getScopes({})).to.eql([]);
  });
});
