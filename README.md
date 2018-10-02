# Auth0 Delegated Administration Extension
[![CircleCI](https://circleci.com/gh/auth0-extensions/auth0-delegated-administration-extension.svg?style=svg)](https://circleci.com/gh/auth0-extensions/auth0-delegated-administration-extension)

## Running in Production

```bash
npm install
npm run client:build
npm run server:prod
```

## Running in Development

To run the extension:

```bash
yarn install --production=false --ignore-engines
yarn run build
yarn run serve:dev
```

### Configuration

Update the configuration file under `./server/config.json`:

```json
{
  "AUTHORIZE_API_KEY": "mysecret",
  "EXTENSION_SECRET": "mysecret",
  "PUBLIC_WT_URL": "http://localhost:3000/",
  "WT_URL": "http://localhost:3000/",
  "AUTH0_DOMAIN": "me.auth0.com",
  "AUTH0_CLIENT_ID": "myclientid",
  "AUTH0_CLIENT_SECRET": "myclientsecret",
  "EXTENSION_CLIENT_ID": "myotherclientid",
  "AUTH0_RTA": "https://tbc.auth0.com/"
}
```

As you can see, there are 2 clients involved here.

**Management API Client**

First you'll need to create a "Non Interactive Client" and add the details in `AUTH0_DOMAIN` / `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET`. Then go to [APIs](https://manage.auth0.com/#/apis) and add the "Non Interactive Client" there with the following scopes:

```
read:clients read:connections read:users update:users delete:users create:users read:logs read:device_credentials update:device_credentials delete:device_credentials
```

This client will be used to interact with the Management API (eg: load users, ....).

> Note: When installing this as a real extension it will be done automatically.

**Client for End Users**

This extension allows end users to login, not dashboard administrators. This means that we need to secure this extension in the same way that we secure other applications in Auth0.

 1. Create a "Single Page Application" in Clients
 2. Put `http://localhost:3000/login` as an `Allowed Callback URL`.
 3. Add the Client ID to the `EXTENSION_CLIENT_ID` setting.
 4. Then in the Client, under Advanced Settings, OAuth2 change the value from `HS256` to `RS256`.
 5. Choose a connection (eg: DB connection) and only enable that one in your Client (Connections tab).

## Custom Style

Customers can choose to implement their custom style, to do so the following settings can be added:

```json
{
  "TITLE": "Fabrikam User Management",
  "CUSTOM_CSS": "https://rawgit.com/auth0-extensions/auth0-delegated-administration-extension/master/docs/theme/fabrikam.css"
}
```

The CSS file has to be hosted by the customer and can be used to change the style of every component. An example can be found under [docs/theme](docs/theme).

## Usage

See the [official documentation page on docs.auth0.com](https://auth0.com/docs/extensions/delegated-admin).
