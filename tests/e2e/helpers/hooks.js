// Example filter hook from the DAE manual testing flows doc: only show users with the same email domain as the current user
const SAME_EMAIL_DOMAIN_FILTER_HOOK = `function(ctx, callback) {
  // Get the domain from the current user's metadata.
  var domain = ctx.request.user.email.split("@")[1];

  // Okta Users can see all users
  if (domain === 'okta.com') {
    return callback();
  }

  // Return the lucene query.
  return callback(null, 'email.domain:"' + domain + '"');
}`;

// Custom fields settings and write hooks from the DAE manual testing flows doc
const CUSTOM_FIELDS_SETTINGS_HOOK = `function (ctx, callback) {
  return callback(null, {
    userFields: [
      {
        'label': 'InputMultiCombo Field',
        'property': 'app_metadata.input_multi_combo',
        'edit': {
          'type': 'select',
          'component': 'InputMultiCombo',
          'options': ['AppOne', 'AppTwo', 'AppThree']
        }
      },
      {
        'label': 'InputSelectCombo Field',
        'property': 'app_metadata.input_select_combo',
        'edit': {
          'type': 'select',
          'component': 'InputSelectCombo',
          'options': ['AppOne', 'AppTwo', 'AppThree']
        }
      }
    ]
  });
}`;

const CUSTOM_FIELDS_WRITE_HOOK = `function create(ctx, callback) {
  var payload = ctx.payload;
  var appMeta = payload.app_metadata || {};

  if (appMeta.input_multi_combo) {
    appMeta.input_multi_combo = appMeta.input_multi_combo.map(function(item) {
      return typeof item === 'object' ? item.value : item;
    });
  }

  if (appMeta.input_select_combo) {
    appMeta.input_select_combo = typeof appMeta.input_select_combo === 'object'
      ? appMeta.input_select_combo.value
      : appMeta.input_select_combo;
  }

  if (ctx.method === 'update') {
    return callback(null, {
      email:        payload.email,
      connection:   payload.connection,
      password:     payload.password,
      app_metadata: appMeta,
    });
  }

  return callback(null, {
    email:        payload.email,
    connection:   payload.connection,
    password:     payload.password,
    app_metadata: appMeta,
  });
}`;

// Matches the ScriptManager cache maxAge in server/lib/scriptmanager.js; each server instance caches hooks separately
const HOOK_CACHE_TTL_MS = 10000;

module.exports = {
  SAME_EMAIL_DOMAIN_FILTER_HOOK,
  CUSTOM_FIELDS_SETTINGS_HOOK,
  CUSTOM_FIELDS_WRITE_HOOK,
  HOOK_CACHE_TTL_MS
};
