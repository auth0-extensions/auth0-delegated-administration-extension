const url = require('url');

const USE_WILDCARD_DOMAIN = 3;
const USE_CUSTOM_DOMAIN = 2;
const USE_SHARED_DOMAIN = 1;
const SANITIZE_RX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g; // eslint-disable-line no-useless-escape

const getBasePath = function(originalUrl, path) {
  var basePath = url.parse(originalUrl).pathname || '';
  var sanitizedPath = ''
  if (path) {
    sanitizedPath = path.replace(SANITIZE_RX, '\\$&')
  }

  basePath = basePath.replace(new RegExp(sanitizedPath + '$'), '')
    // Strip leading and trailing slashes
    .replace(/^\/|\/$/g, '');
  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }
  if (!basePath.endsWith('/')) {
    basePath += '/';
  }
  return basePath;
};

module.exports.getBasePath = function(req) {
  return getBasePath(req.originalUrl || '', req.path);
};

module.exports.getBaseUrl = function(req, protocol) {
  var urlProtocol = protocol;
  if (!urlProtocol && process.env.NODE_ENV === 'development') {
    urlProtocol = 'http';
  }

  const originalUrl = url.parse(req.originalUrl || '').pathname || '';

  var sanitizedPath = ''
  if (req.path) {
    sanitizedPath = req.path.replace(SANITIZE_RX, '\\$&')
  }

  return url.format({
    protocol: urlProtocol || 'https',
    host: req.headers.host,
    pathname: originalUrl.replace(new RegExp(sanitizedPath + '$'), '').replace(/\/$/g, '')
  });
};

function createRouteNormalizationRx(claims) {
  if (!claims.container) {
    return null;
  }

  const container = claims.container.replace(SANITIZE_RX, '\\$&');
  const name = claims.jtn
      ? claims.jtn.replace(SANITIZE_RX, '\\$&')
      : '';

  if (claims.url_format === USE_SHARED_DOMAIN) {
    return new RegExp('^/api/run/' + container + '/(?:' + name + '/?)?');
  } else if (claims.url_format === USE_CUSTOM_DOMAIN) {
    return new RegExp('^/' + container + '/(?:' + name + '/?)?');
  } else if (claims.url_format === USE_WILDCARD_DOMAIN) {
    return new RegExp('^/(?:' + name + '/?)?');
  }

  throw new Error('Unsupported webtask URL format.');
}

function getWTRegionalUrl(wtUrl, container) {
  if (!wtUrl) {
    return null;
  }

  const nodeVersion = (wtUrl.indexOf('sandbox8') >= 0) ? '8' : '';
  const firstPart = wtUrl.split('.it.auth0.com')[0];
  const region = firstPart.split('-')[1] || 'us';

  return 'https://' + container + '.' + region + nodeVersion + '.webtask.io/';
}

module.exports.getWebtaskUrl = function(req) {
  const normalizeRouteRx = createRouteNormalizationRx(req.x_wt);
  const requestOriginalUrl = req.url;
  const requestUrl = req.url.replace(normalizeRouteRx, '/');
  const requestPath = url.parse(requestUrl || '').pathname;
  const isIsolatedDomain = (req.x_wt && req.x_wt.ectx && req.x_wt.ectx.ISOLATED_DOMAIN) || false;
  const originalUrl = url.parse(requestOriginalUrl || '').pathname || '';

  var webtaskUrl;
  if (!isIsolatedDomain) {
    webtaskUrl = originalUrl;
  } else {
    webtaskUrl = url.format({
      protocol: 'https',
      host: req.headers.host,
      pathname: originalUrl.replace(requestPath, '').replace(/\/$/g, '')
    });

    const trigger = '.it.auth0.com/api/run/' + req.x_wt.container + '/';
    const regionalUrl = getWTRegionalUrl(webtaskUrl, req.x_wt.container);

    if (webtaskUrl.indexOf(trigger) >= 0) {
      webtaskUrl = webtaskUrl.replace('https://' + req.headers.host + '/api/run/' + req.x_wt.container + '/', regionalUrl);
    }
  }

  return webtaskUrl;
};
