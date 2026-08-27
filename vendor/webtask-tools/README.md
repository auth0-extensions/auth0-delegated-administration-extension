# webtask-tools (vendored fork)

This is a vendored copy of [`auth0/webtask-tools`](https://github.com/auth0/webtask-tools)
`v3.5.0`, with a single change:

- The webtask-storage helpers (`context.read` / `context.write`, i.e. `readFromPath` /
  `writeToPath` in `lib/index.js`) previously used the deprecated, end-of-life
  [`request`](https://github.com/request/request/issues/3142) package via an **undeclared**
  `require('request')`. They have been rewritten to use
  [`superagent`](https://www.npmjs.com/package/superagent), which `webtask-tools` already
  declares as a dependency.

## Why vendored instead of patched upstream

The upstream `auth0/webtask-tools` repository is **archived** — no new releases can be
published. `request` is deprecated and receives no security fixes. Because the package
never declared `request` in its `dependencies`, our build (`a0-ext build:server`, which
externalizes only *declared* dependencies) required us to carry `request` as a top-level
dependency purely to satisfy this transitive `require`. Removing `request` from our tree
without this fork breaks both the packaged build and local `serve`.

This fork removes the last `request` usage in our dependency tree. See IDS-7520 / SEC-69048.

## How it is consumed

Referenced from the root `package.json` as `"webtask-tools": "file:./vendor/webtask-tools"`,
plus `overrides` entries so `auth0-extension-express-tools` and `auth0-extension-tools`
also resolve to this copy.

## Behavioral note

The `request` → `superagent` rewrite preserves the original callback semantics
(`.ok(() => true)` is used so non-2xx responses flow through the same status-code branching
as before, rather than being surfaced as transport errors).
