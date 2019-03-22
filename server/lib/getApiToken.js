import Promise from 'bluebird';
import { managementApi } from 'auth0-extension-tools';

import config from './config';

export default (req) => {
  if (req && req.user && req.user.access_token) {
    return new Promise(resolve => resolve(req.user.access_token));
  }

  return managementApi.getAccessTokenCached(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'));
}
