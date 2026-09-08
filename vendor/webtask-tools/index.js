exports.auth0 = require('./auth0/auth0');
exports.fromConnect = exports.fromExpress = fromConnect;

const SANITIZE_RX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

// API functions

function addAuth0(func) {
    func.auth0 = function (options) {
        return exports.auth0(func, options);
    }

    return func;
}

// this is the fromExpress that we use
function fromConnect (connectFn) {
    return addAuth0(function (context, req, res) {
        var normalizeRouteRx = createRouteNormalizationRx(req.x_wt);

        req.originalUrl = req.url;
        req.url = req.url.replace(normalizeRouteRx, '/');
        req.webtaskContext = context;

        return connectFn(req, res);
    });
}

// Helper functions

const USE_WILDCARD_DOMAIN = 3;
const USE_CUSTOM_DOMAIN = 2;
const USE_SHARED_DOMAIN = 1;

// we use this
function createRouteNormalizationRx(claims) {
    var container = claims.container.replace(SANITIZE_RX, '\\$&');
    var name = claims.jtn
        ? claims.jtn.replace(SANITIZE_RX, '\\$&')
        : '';

    if (claims.url_format === USE_SHARED_DOMAIN) {
        return new RegExp(`^\/api/run/${container}/(?:${name}\/?)?`);
    }
    else if (claims.url_format === USE_CUSTOM_DOMAIN) {
        return new RegExp(`^\/${container}/(?:${name}\/?)?`);
    }
    else if (claims.url_format === USE_WILDCARD_DOMAIN) {
        return new RegExp(`^\/(?:${name}\/?)?`);
    }
    else {
        throw new Error('Unsupported webtask URL format.');
    }
}
