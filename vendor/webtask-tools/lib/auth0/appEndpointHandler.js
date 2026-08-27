'use strict';

module.exports = function (webtask, options, ctx, req, res, routingInfo) {
    return options.exclude && options.exclude(ctx, req, routingInfo.appPath)
        ? run()
        : authenticate();

    function authenticate() {
        const token = options.getAccessToken(ctx, req);
        if (!token) {
            return options.loginError({
                code: 401,
                message: 'Unauthorized.',
                error: 'Missing access token.',
                redirect: routingInfo.baseUrl + '/login',
            }, ctx, req, res, routingInfo.baseUrl);
        }
        options.validateToken(ctx, req, token, function (error, user) {
            if (error) {
                return options.loginError({
                    code: error.code || 401,
                    message: error.message || 'Unauthorized.'
                }, ctx, req, res, routingInfo.baseUrl);
            }
            else {
                ctx.accessToken = token;
                ctx.user = req.user = user;
                authorize();
            }
        });
    }

    function authorize() {
        if  (options.authorized && !options.authorized(ctx, req)) {
            return options.loginError({
                code: 403,
                message: 'Forbidden.'
            }, ctx, req, res, routingInfo.baseUrl);        
        }

        return run();
    }

    function run() {
        // Route request to webtask code
        return webtask(ctx, req, res);
    }
};
