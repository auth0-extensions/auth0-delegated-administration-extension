var getAuthParams = require('./authParams')

module.exports = function (options, ctx, req, res, routingInfo) {
    if (!ctx.query.code) {
        return options.loginError({
            code: 401,
            message: 'Authentication error.',
            callbackQuery: ctx.query
        }, ctx, req, res, routingInfo.baseUrl);
    }

    var authParams = getAuthParams(options, ctx, req);
    if (!authParams) {
        return options.loginError({
            code: 400,
            message: 'Auth0 Client ID, Client Secret, and Auth0 Domain must be specified.'
        }, ctx, res, res, routingInfo.baseUrl);
    }

    return require('superagent')
        .post('https://' + authParams.domain + '/oauth/token')
        .type('form')
        .send({
            client_id: authParams.clientId,
            client_secret: authParams.clientSecret,
            redirect_uri: routingInfo.baseUrl + '/callback',
            audience: authParams.audience,
            code: ctx.query.code,
            grant_type: 'authorization_code'
        })
        .timeout(15000)
        .end(function (err, ares) {
            if (err || !ares.ok) {
                return options.loginError({
                    code: 502,
                    message: 'OAuth code exchange completed with error.',
                    error: err && err.message,
                    auth0Status: ares && ares.status,
                    auth0Response: ares && (ares.body || ares.text)
                }, ctx, req, res, routingInfo.baseUrl);
            }

            return issueAccessToken(ares.body.id_token, ares.body.access_token);
        });

    function issueAccessToken(id_token, access_token) {
        var jwt = require('jsonwebtoken');
        try {
            req.user = ctx.user = jwt.decode(id_token);
        }
        catch (e) {
            return options.loginError({
                code: 502,
                message: 'Cannot parse id_token returned from Auth0.',
                id_token: id_token,
                error: e.message
            }, ctx, req, res, routingInfo.baseUrl);
        }

        ctx.accessToken = options.createToken(ctx, req, id_token, access_token);
        if (typeof ctx.accessToken !== 'string') {
            return options.loginError({
                code: 400,
                message: 'The createToken function did not return a string access token.'
            }, ctx, req, res, routingInfo.baseUrl);
        }

        // Perform post-login action (redirect to /?access_token=... by default)
        return options.loginSuccess(ctx, req, res, routingInfo.baseUrl);
    }
};
