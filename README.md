# Auth0 Delegated Administration Extension
[![CircleCI](https://circleci.com/gh/auth0-extensions/auth0-delegated-administration-extension.svg?style=svg)](https://circleci.com/gh/auth0-extensions/auth0-delegated-administration-extension)
[![codecov](https://codecov.io/gh/auth0-extensions/auth0-delegated-administration-extension/branch/master/graph/badge.svg)](https://codecov.io/gh/auth0-extensions/auth0-delegated-administration-extension)

## Running in Production

```bash
npm install
npm run client:build
npm run server:prod
```

## Running in Development

To run the extension:

```bash
npm install
npm run build
npm run serve:dev
```

### Configuration

Update the configuration file under `./server/config.json`:

```json
{
  "EXTENSION_CLIENT_ID": "SPA_CLIENT_ID",
  "EXTENSION_SECRET": "Random Secret",
  "WT_URL": "http://localhost:3001",
  "PUBLIC_WT_URL": "http://localhost:3001",
  "AUTH0_RTA": "https://auth0.auth0.com",
  "AUTH0_DOMAIN": "{tenant-name.region}.auth0.com",
  "AUTH0_CLIENT_ID": "GENERIC_CLIENT_ID",
  "AUTH0_CLIENT_SECRET": "GENERIC_CLIENT_SECRET"
}
```

As you can see, there are 2 clients involved here.

**Management API Client**


Relevant properties for this section: `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET`

To get this client setup quickly, install the Delegated Admin Extension on the [dashboard](https://manage.auth0.com/#/extensions). This will create a generic auth0-delegated-admin client/application. Grab the client and secret for this app to populate the config values.

You may also create this client manually by going to [APIs](https://manage.auth0.com/#/apis) and add the "Non Interactive Client" there with the following scopes:

```
read:clients delete:clients read:connections read:users update:users delete:users create:users read:logs read:device_credentials update:device_credentials delete:device_credentials delete:guardian_enrollments
```

This client will be used to interact with the Management API (eg: load users, ....).


**Client for End Users**

Relevant properties for this section: `EXTENSION_CLIENT_ID`.

This extension allows end users to login, not dashboard administrators. This means that we need to secure this extension in the same way that we secure other applications in Auth0.

 1. Create a "Single Page Application" in Clients
 2. Put `http://localhost:3001/login` as an `Allowed Callback URL`.
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
