## [2.3.4] - 2017-01-20

### Fixed

- Polyfill everything with 'babel-polyfill'

## [2.3.3] - 2017-01-20

### Fixed

- Polyfill for `Promise` in IE

## [2.3.2] - 2017-01-18

### Fixed

- Polyfill for `string.endsWith` in IE

## [2.3.0] - 2016-10-20

### Changes

- The Memberships hooks is now consistent with the other hooks. `ctx.request.user` represents the user that is currently logged in and `ctx.payload.user` represents the user for which the memberships have to be loaded.

## [2.2.0] - 2016-10-20

### Changes

- Extension no longer uses to hash as a name (auth0-delegated-admin is used instead).

## [2.1.0] - 2016-10-10

### Changes

- Only show web, spa and mobile apps in password reset page
- Better loading animation at startup.
- Support creation of memberships.
- Highlight tabs that have no script set.
- Allow reading and writing custom data in hooks
- Expose require in the hooks.
- Expose cache in hook context.
- Use the hosted login page when logging in
- Show username in the header
- Delay user reload after creating user (to take indexing into account)
- Unknown log types are now displayed as "Unknown Event"

## [2.0.1] - 2016-09-23

### Fixed

- Fix issue in UI when the user's memberships are null.

## [2.0.0]

### Changes

- Support delegated administration with memberships (eg: people in my group, department, office, ...) through "hooks".
