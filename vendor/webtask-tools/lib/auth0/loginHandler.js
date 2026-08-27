'use strict';

const getAuthParams = require('./authParams');

module.exports = function(options, ctx, req, res, routingInfo) {
    const authParams = getAuthParams(options, ctx, req);
    const scope = 'openid name email email_verified ' + (options.scope || '');
    if (!authParams) {
        // TODO, tjanczuk, support the shared Auth0 application case
        return options.loginError({
            code: 400,
            message: 'You must specify Auth0 client ID, client secret, and domain when creating the webtask. See https://webtask.io/docs/auth for details.'
        }, ctx, req, res, routingInfo.baseUrl);
        // Neither client id or domain are specified; use shared Auth0 settings
        // var authUrl = 'https://auth0.auth0.com/i/oauth2/authorize'
        //     + '?response_type=code'
        //     + '&audience=https://auth0.auth0.com/userinfo'
        //     + '&scope=' + encodeURIComponent(scope)
        //     + '&client_id=' + encodeURIComponent(routingInfo.baseUrl)
        //     + '&redirect_uri=' + encodeURIComponent(routingInfo.baseUrl + '/callback');
        // res.writeHead(302, { Location: authUrl });
        // return res.end();
    }
    else {
        // Use custom Auth0 account
        const authUrl = 'https://' + authParams.domain + '/authorize' 
            + '?response_type=code'
            + '&scope=' + encodeURIComponent(scope)
            + '&client_id=' + encodeURIComponent(authParams.clientId)
            + '&audience=' + encodeURIComponent(authParams.audience)
            + '&redirect_uri=' + encodeURIComponent(routingInfo.baseUrl + '/callback');
        res.writeHead(302, { Location: authUrl });
        return res.end();
    }
};
