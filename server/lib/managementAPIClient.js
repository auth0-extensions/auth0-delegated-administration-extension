import config from '../lib/config';

const getClientOptions = (req, customHeaders) => {
    const handlerOptions = {
            domain: config("AUTH0_DOMAIN"),
            clientId: config("AUTH0_CLIENT_ID"),
            clientSecret: config("AUTH0_CLIENT_SECRET"),
    };
    
    const isAdministrator =
        req.user && req.user.access_token && req.user.access_token.length;

    
    const options = !isAdministrator
    ? handlerOptions
    : {
        domain: handlerOptions.domain,
        accessToken: req.user.access_token,
        };
    
    if (customHeaders) {
        options.headers = customHeaders;
    }

    // It's important to use getClient for the management API token to be cached.
    // If we instantiate the client directly, a client credentials exchange will be performed on every request.
    // console.warn("getClientOptions", options)
    return options;
}

module.exports = {
    getClientOptions
};