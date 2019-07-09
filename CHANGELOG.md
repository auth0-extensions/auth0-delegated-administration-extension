# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.6.4] - 2019-07-09

### Fixed

- User permissions check for PSaaS with custom domain enabled

## [3.6.3] - 2019-05-28

### Fixed

- Extra information leak for connections and applications
- Rendering of reserved fields in custom field edit form

## [3.6.2] - 2019-04-20

### Updated

- Build, deploy and release process update.

## [3.6.2] - 2019-04-25

### Fixed
- `Remove MFA` for unconfirmed enrollments

## [3.6.1] - 2019-04-19

### Fixed

- `PUBLIC_WT_URL` generation fixed for specific clusters

## [3.6.0] - 2019-04-01

### Added

- Custom domains support

## [3.5.0] - 2019-03-20

### Added

- New role - `Delegated Admin - Operator`. Users with this role have access to users management and logs, but don't have access to the extension configuration.

### Fixed

- Fixed bug which doesn't allow to override client field for `reset password` action

## [3.4.5] - 2019-02-21

### Added

- Added new log types

## [3.4.4] - 2019-02-11

### Fixed

- Create user with empty `settings query` bug fixed.

## [3.4.3] - 2019-01-24

### Added

- `canCreateUser` property added to the `settings` hook. It is `true` by default.

## [3.4.2] - 2019-01-17

### Fixed

- `Remove MFA` for `any` provider.

## [3.4.1] - 2019-01-04

### Fixed

- `Connection` field will be hidden, if there is only one connection. #155
- `Connection` field now properly showing connection name, if there are more than one connection.
- default `returnTo` path for auth

### Changed

- update to `auth0.js v9.8.2`

## [3.4.0] - 2018-10-25

### Added

- Ability to remove menu items from the User Details action menu. #133

### Changed

- Added `value` as second argument of userField display function. #132
- Fixed userField edit.display function. #132
- Builds are now done on node 8. #134

## [3.3.0] - 2018-10-22

### Added

- Add `InputVirtualizedSelect` input component for custom fields. #131

## [3.2.2] - 2018-10-9

### Changed

- Dropdown select fields will show a placeholder that lets the user know that they need to select an option, even if its one option that exist. #124

## [3.0.0] - 2018-06-04

### Changes

- MAJOR UPDATE: Add ability to set custom user fields
  - This allows you to suppress fields that exist or add new fields
  - This pushes all updates through the write hook if you are making updates
- Update to latest version of auth0.js for login
- Uses a get on the user instead of the ID token for getting app_metadata
- Adds localization support
- Fixes require bug so that any require available to rules is available to the hooks

## [2.5.0] - 2017-10-25

### Changes

- Add ability to remove Multifactor for Guardian

## [2.4.7] - 2017-09-07

### Changes

- Added new audit log types
- Fixed unknown logtype message

## [2.4.6] - 2017-09-07

### Changes

- Removed `group` scope when authenticating

## [2.4.4] - 2017-06-15

### Changes

- Added option to use federated logout
- Fixed issue with hooks that seemed to call `require(.)`

## [2.4.3] - 2017-06-06

### Changes

- Update auth0.js and make it use the v2 logout endpoint

## [2.4.2] - 2017-06-06

### Fixed

- Improve logout in Auth0

## [2.4.1] - 2017-05-30

### Fixed

- Issue with extension startup

## [2.4.0] - 2017-05-30

### Fixed

- Always show user actions, also when database connections are not available

### Changes

- Added users pagination.
- Create user by default with memberships in app_metadata in case the Create script is not available.

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
