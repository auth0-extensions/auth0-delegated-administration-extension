'use strict';

module.exports = function (options, ctx, req) {
    const authParams = {
        clientId: options.clientId(ctx, req),
        domain: options.domain(ctx, req),
        clientSecret: options.clientSecret(ctx, req),
        secretEncoding: options.secretEncoding(ctx, req),
        audience: options.audience(ctx, req)
    };
    const count = !!authParams.clientId + !!authParams.audience + !!authParams.domain + !!authParams.clientSecret + !!authParams.secretEncoding;
    return count === 5 ? authParams : null;
};
