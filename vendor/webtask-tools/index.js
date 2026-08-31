exports.auth0 = require('./auth0/auth0');
exports.fromConnect = exports.fromExpress = fromConnect;
exports.fromHapi = fromHapi;
exports.fromServer = exports.fromRestify = fromServer;

/*
var app = new (require('express'))();

app.get('/', function (req, res) {
   res.send('Hello, world');
});

module.exports = app;
*/
exports.express = function (options, cb) {
    options.nodejsCompiler(options.script, function (error, func) {
        if (error) return cb(error);
        try {
            func = fromConnect(func);
        }
        catch (e) {
            return cb(e);
        }
        return cb(null, func);
    });
};

// File rendering
exports.html = function (options, cb) {
    render(options, cb, (script)=>script);
};

exports.pug = function (options, cb) {
    var pug = require('pug');
    render(options, cb, (script)=>pug.render(script));
};

exports.jade = exports.pug;

function render(options, cb, render) {
    cb(null, (ctx, req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var html = render(options.script);
        res.end(html);
    });
}

/*
async (dynamic context) => {
    return "Hello, world!";
}
*/
exports.cs = function (options, cb) {
    cb(null, require('edge').func(options.script));
};

const SANITIZE_RX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

// API functions

function addAuth0(func) {
    func.auth0 = function (options) {
        return exports.auth0(func, options);
    }

    return func;
}

function fromConnect (connectFn) {
    return addAuth0(function (context, req, res) {
        var normalizeRouteRx = createRouteNormalizationRx(req.x_wt);

        req.originalUrl = req.url;
        req.url = req.url.replace(normalizeRouteRx, '/');
        req.webtaskContext = attachStorageHelpers(context);

        return connectFn(req, res);
    });
}

function fromHapi(server) {
    var webtaskContext;

    server.ext('onRequest', function (request, response) {
        var normalizeRouteRx = createRouteNormalizationRx(request.x_wt.jtn);

        request.setUrl(request.url.replace(normalizeRouteRx, '/'));
        request.webtaskContext = webtaskContext;
    });

    return addAuth0(function (context, req, res) {
        var dispatchFn = server._dispatch();

        webtaskContext = attachStorageHelpers(context);

        dispatchFn(req, res);
    });
}

function fromServer(httpServer) {
    return addAuth0(function (context, req, res) {
        var normalizeRouteRx = createRouteNormalizationRx(req.x_wt);

        req.originalUrl = req.url;
        req.url = req.url.replace(normalizeRouteRx, '/');
        req.webtaskContext = attachStorageHelpers(context);

        return httpServer.emit('request', req, res);
    });
}


// Helper functions

const USE_WILDCARD_DOMAIN = 3;
const USE_CUSTOM_DOMAIN = 2;
const USE_SHARED_DOMAIN = 1;

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

function attachStorageHelpers(context) {
    context.read = context.secrets.EXT_STORAGE_URL
        ?   readFromPath
        :   readNotAvailable;
    context.write = context.secrets.EXT_STORAGE_URL
        ?   writeToPath
        :   writeNotAvailable;

    return context;


    function readNotAvailable(path, options, cb) {
        var Boom = require('boom');

        if (typeof options === 'function') {
            cb = options;
            options = {};
        }

        cb(Boom.preconditionFailed('Storage is not available in this context'));
    }

    function readFromPath(path, options, cb) {
        var Boom = require('boom');
        var Request = require('request');

        if (typeof options === 'function') {
            cb = options;
            options = {};
        }

        Request({
            uri: context.secrets.EXT_STORAGE_URL,
            method: 'GET',
            headers: options.headers || {},
            qs: { path: path },
            json: true,
        }, function (err, res, body) {
            if (err) return cb(Boom.boomify(err, { statusCode: 502 }));
            if (res.statusCode === 404 && Object.hasOwnProperty.call(options, 'defaultValue')) return cb(null, options.defaultValue);
            if (res.statusCode >= 400) return cb(new Boom(body && body.message, { statusCode: res.statusCode }));

            cb(null, body);
        });
    }

    function writeNotAvailable(path, data, options, cb) {
        var Boom = require('boom');

        if (typeof options === 'function') {
            cb = options;
            options = {};
        }

        cb(Boom.preconditionFailed('Storage is not available in this context'));
    }

    function writeToPath(path, data, options, cb) {
        var Boom = require('boom');
        var Request = require('request');

        if (typeof options === 'function') {
            cb = options;
            options = {};
        }

        Request({
            uri: context.secrets.EXT_STORAGE_URL,
            method: 'PUT',
            headers: options.headers || {},
            qs: { path: path },
            body: data,
        }, function (err, res, body) {
            if (err) return cb(Boom.boomify(err, { statusCode: 502 }));
            if (res.statusCode >= 400) return cb(new Boom(body && body.message, { statusCode: res.statusCode }));

            cb(null);
        });
    }
}
