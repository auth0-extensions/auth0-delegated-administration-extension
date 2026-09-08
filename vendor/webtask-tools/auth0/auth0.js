'use strict';

const Url = require('url');
const Buffer = require('safe-buffer').Buffer
const handleAppEndpoint = require('./appEndpointHandler');
const handleLogin = require('./loginHandler');
const handleCallback = require('./callbackHandler');
const getAuthParams = require('./authParams');

module.exports = function (webtask, options) {
    if (typeof webtask !== 'function' || webtask.length !== 3) {
        throw new Error('The auth0() function can only be called on webtask functions with the (ctx, req, res) signature.');
    }
    if (!options) {
        options = {};
    }
    if (typeof options !== 'object') {
        throw new Error('The options parameter must be an object.');
    }
    if (options.scope && typeof options.scope !== 'string') {
        throw new Error('The scope option, if specified, must be a string.');
    }
    if (options.authorized && ['string','function'].indexOf(typeof options.authorized) < 0 && !Array.isArray(options.authorized)) {
        throw new Error('The authorized option, if specified, must be a string or array of strings with e-mail or domain names, or a function that accepts (ctx, req) and returns boolean.');
    }
    if (options.exclude && ['string','function'].indexOf(typeof options.exclude) < 0 && !Array.isArray(options.exclude)) {
        throw new Error('The exclude option, if specified, must be a string or array of strings with URL paths that do not require authentication, or a function that accepts (ctx, req, appPath) and returns boolean.');
    }
    if (options.clientId && typeof options.clientId !== 'function') {
        throw new Error('The clientId option, if specified, must be a function that accepts (ctx, req) and returns an Auth0 Client ID.');
    }
    if (options.clientSecret && typeof options.clientSecret !== 'function') {
        throw new Error('The clientSecret option, if specified, must be a function that accepts (ctx, req) and returns an Auth0 Client Secret.');
    }
    if (options.secretEncoding && typeof options.secretEncoding !== 'function') {
        throw new Error('The secretEncoding option, if specified, must be a function that accepts (ctx, req) and returns a character encoding name for use with the "Buffer" class.');
    }
    if (options.audience && typeof options.audience !== 'function') {
        throw new Error('The audience option, if specified, must be a function that accepts (ctx, req) and returns an Auth0 Client Audience.');
    }
    if (options.domain && typeof options.domain !== 'function') {
        throw new Error('The domain option, if specified, must be a function that accepts (ctx, req) and returns an Auth0 Domain.');
    }
    if (options.createToken && typeof options.createToken !== 'function') {
        throw new Error('The createToken option, if specified, must be a function that accepts (ctx, res, idToken, accessToken) and returns an access token that can be used to authenticate future calls to webtask APIs.');
    }
    if (options.getAccessToken && typeof options.getAccessToken !== 'function') {
        throw new Error('The getAccessToken option, if specified, must be a function that accepts (ctx, req) and returns the access token associated with the request, or null.');
    }
    if (options.validateToken && typeof options.validateToken !== 'function') {
        throw new Error('The validateToken option, if specified, must be a function that accepts (ctx, req, token, cb) and calls the callback with (error, userProfile).');
    }
    if (options.loginSuccess && typeof options.loginSuccess !== 'function') {
        throw new Error('The loginSuccess option, if specified, must be a function that accepts (ctx, req, res, baseUrl) and generates a response.');
    }
    if (options.loginError && typeof options.loginError !== 'function') {
        throw new Error('The loginError option, if specified, must be a function that accepts (error, ctx, req, res, baseUrl) and generates a response.');
    }

    options.clientId = options.clientId || function (ctx, req) {
        return ctx.secrets.AUTH0_CLIENT_ID;
    };
    options.clientSecret = options.clientSecret || function (ctx, req) {
        return ctx.secrets.AUTH0_CLIENT_SECRET;
    };
    options.secretEncoding = options.secretEncoding || function (ctx, req) {
        return (ctx.secrets.AUTH0_SECRET_ENCODING === undefined) ? 'base64' : ctx.secrets.AUTH0_SECRET_ENCODING;
    };
    options.domain = options.domain || function (ctx, req) {
        return ctx.secrets.AUTH0_DOMAIN;
    };
    options.audience = options.audience || function (ctx, req) {
        return ctx.secrets.AUTH0_AUDIENCE;
    };
    options.createToken = options.createToken || function (ctx, req, idToken, accessToken) {
        return idToken;
    };
    options.getAccessToken = options.getAccessToken || function (ctx, req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else {
            return req.query && req.query.access_token;
        }
    };
    options.validateToken = options.validateToken || function (ctx, req, token, cb) {
        const authParams = getAuthParams(options, ctx, req);
        if (!authParams) {
            return cb({
                code: 400,
                message: 'Auth0 Client ID, Client Secret, and Auth0 Domain must be specified.'
            });
        }

        // Validate Auth0 issued id_token
        getSecretOrPublicKey(authParams, token, function (err, secretOrPublicKey) {
            if (err) {
                return cb({
                    code: 400,
                    message: err.message
                });
            }
        
            let user;
            try {
                user = require('jsonwebtoken').verify(token, secretOrPublicKey, {
                    audience: authParams.audience || authParams.clientId,
                    issuer: 'https://' + authParams.domain + '/'
                });
            }
            catch (e) {
                return cb({
                    code: 401,
                    message: 'Unauthorized: ' + e.message
                });
            }
            return cb(null, user);
        });
    };
    options.loginSuccess = options.loginSuccess || function (ctx, req, res, baseUrl) {
        res.writeHead(302, { Location: `${ baseUrl }?access_token=${ ctx.accessToken }` });
        return res.end();
    };
    options.loginError = options.loginError || function (err, ctx, req, res, baseUrl) {
        if (req.method === 'GET') {
            if (err.redirect) {
                res.writeHead(302, { Location: err.redirect, 'x-wt-error': err.message });
                return res.end(JSON.stringify(err));
            }
            else if (err.code === 400) {
                return error(err, res);
            }
            res.writeHead(err.code || 401, { 
                'Content-Type': 'text/html', 
                'Cache-Control': 'no-cache',
                'x-wt-error': err.message
            });
            return res.end(getNotAuthorizedHtml(baseUrl + '/login'));
        }
        else {
            // Reject all other requests
            return error(err, res);
        }            
    };
    if (typeof options.authorized === 'string') {
        options.authorized = [ options.authorized ];
    }
    if (Array.isArray(options.authorized)) {
        const authorized = [];
        options.authorized.forEach(function (a) {
            authorized.push(a.toLowerCase());
        });
        options.authorized = function (ctx, res) {
            if (ctx.user.email_verified) {
                for (let i = 0; i < authorized.length; i++) {
                    const email = ctx.user.email.toLowerCase();
                    if (email === authorized[i] || authorized[i][0] === '@' && email.indexOf(authorized[i]) > 1) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    if (typeof options.exclude === 'string') {
        options.exclude = [ options.exclude ];
    }
    if (Array.isArray(options.exclude)) {
        const exclude = options.exclude;
        options.exclude = function (ctx, res, appPath) {
            return exclude.indexOf(appPath) > -1;
        }
    }

    return createAuthenticatedWebtask(webtask, options);
};

function createAuthenticatedWebtask(webtask, options) {

    // Inject middleware into the HTTP pipeline before the webtask handler
    // to implement authentication endpoints and perform authentication 
    // and authorization.

    return function (ctx, req, res) {
        if (!req.x_wt.jtn || !req.x_wt.container) {
            return error({
                code: 400,
                message: 'Auth0 authentication can only be used with named webtasks.'
            }, res);
        }

        const routingInfo = getRoutingInfo(req);
        if (!routingInfo) {
            return error({
                code: 400,
                message: 'Error processing request URL path.'
            }, res);
        }
        switch (req.method === 'GET' && routingInfo.appPath) {
            case '/login': handleLogin(options, ctx, req, res, routingInfo); break;
            case '/callback': handleCallback(options, ctx, req, res, routingInfo); break;
            default: handleAppEndpoint(webtask, options, ctx, req, res, routingInfo); break;
        };
        return;
    };
}

function getRoutingInfo(req) {
    const routingInfo = Url.parse(req.url, true);
    const segments = routingInfo.pathname.split('/');
    if (segments[1] === 'api' && segments[2] === 'run' && segments[3] === req.x_wt.container && segments[4] === req.x_wt.jtn) {
        // Shared domain case: /api/run/{container}/{jtn}
        routingInfo.basePath = segments.splice(0, 5).join('/');
    }
    else if (segments[1] === req.x_wt.container && segments[2] === req.x_wt.jtn) {
        // Custom domain case: /{container}/{jtn}
        routingInfo.basePath = segments.splice(0, 3).join('/');
    }
    else if (segments[1] === req.x_wt.jtn && req.headers.host.indexOf(req.x_wt.container + '.') === 0) {
        // Webtask subdomain case: //{container}.us.webtask.io/{jtn}
        routingInfo.basePath = segments.splice(0,2).join('/');
    }
    else {
        return null;
    }
    routingInfo.appPath = '/' + segments.join('/');
    routingInfo.baseUrl = [
        (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim(),
        '://',
        req.headers.host,
        routingInfo.basePath
    ].join('');
    return routingInfo;
}

function getNotAuthorizedHtml(loginUrl) {
    const notAuthorizedTemplate = `
    <!DOCTYPE html5>
    <html>
    <head>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link href="https://cdn.auth0.com/styleguide/latest/index.css" rel="stylesheet" />
        <title>Access denied</title>
    </head>
    <body>
        <div class="container">
        <div class="row text-center">
            <h1><a href="https://auth0.com" title="Go to Auth0!"><img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" alt="Auth0 badge" /></a></h1>
            <h1>Not authorized</h1>
            <p><a href="${ loginUrl }">Try again</a></p>
        </div>
        </div>
    </body>
    </html>`;

    return notAuthorizedTemplate;
}

function getSecretOrPublicKey(authParams, token, callback) {
    const decoded = require('jsonwebtoken').decode(token, { complete: true });

    if (decoded.header.alg !== 'RS256') {
        return callback(null, Buffer.from(authParams.clientSecret, authParams.secretEncoding));
    }

    require('superagent')
        .get('https://' + authParams.domain + '/.well-known/jwks.json')
        .set('Accept', 'application/json')
        .timeout(15000)
        .end(function (err, res) {
            if (err || !res.ok || !res.body || !res.body.keys || !Array.isArray(res.body.keys)) {
                return callback({
                    code: 400,
                    message: 'Unable to retrieve JWKS.'
                });
            }

            const publicKey = res.body.keys.reduce(function (prev, key) {
                if (key.use === 'sig' && key.kty === 'RSA' && key.kid === decoded.header.kid && key.x5c && key.x5c.length) {
                    return `-----BEGIN CERTIFICATE-----\n${ key.x5c[0].match(/.{1,64}/g).join('\n') }\n-----END CERTIFICATE-----\n`;
                } else {
                    return prev;
                }
            }, '');

            callback(null, publicKey);
        });
}

function error(err, res) {
    res.writeHead(err.code || 500, { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(err));
}
