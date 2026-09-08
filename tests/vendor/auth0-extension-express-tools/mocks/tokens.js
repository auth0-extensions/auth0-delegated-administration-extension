const crypto = require('crypto');
const nock = require('nock');
const jwt = require('jsonwebtoken');

// jwks-rsa 3.x imports keys via `jose`, which requires the RSA modulus/exponent
// (n/e) on the JWK — x5c alone is no longer sufficient. Derive them from the
// cert's public key at runtime so this stays correct if the fixtures change.
function jwkFromCert(cert) {
  return crypto.createPublicKey(cert).export({ format: 'jwk' });
}

module.exports.wellKnownEndpoint = function(domain, cert, kid) {
  const jwk = jwkFromCert(cert);

  return nock('https://' + domain)
    .get('/.well-known/jwks.json')
    .reply(200, {
      keys: [
        {
          alg: 'RS256',
          use: 'sig',
          kty: 'RSA',
          x5c: [ cert.match(/-----BEGIN CERTIFICATE-----([\s\S]*)-----END CERTIFICATE-----/i)[1].replace(/\s/g, '') ],
          n: jwk.n,
          e: jwk.e,
          kid: kid
        }
      ]
    });
};

module.exports.sign = function(cert, kid, payload) {
  return jwt.sign(payload, cert, { header: { kid: kid }, algorithm: 'RS256' });
};
