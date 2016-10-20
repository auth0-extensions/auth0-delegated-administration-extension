## [2.2.0] - 2016-10-20

### Changed

- Extension no longer uses to hash as a name (auth0-delegated-admin is used instead).

## [2.1.0] - 2016-10-10

### Changed

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

### Changed

- Support delegated administration with memberships (eg: people in my group, department, office, ...) through "hooks".
