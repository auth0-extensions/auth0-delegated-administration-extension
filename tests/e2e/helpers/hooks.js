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

// A sample of the GLN dropdown settings hook from the DAE manual testing flows doc, which uses { value, label } options
const GLN_OPTIONS = [
  '9429040000008',
  '9429040000015',
  '9429040039107',
  '9429040039114',
  '9429040039121',
  '9429040040004',
  '9429040040011',
  '9429040040103',
  '9429040040110',
  '9429040040752'
];

const GLN_DROPDOWN_SETTINGS_HOOK = `function (ctx, callback) {
  const glns = ${JSON.stringify(GLN_OPTIONS)};

  return callback(null, {
    userFields: [
      {
        property: 'app_metadata.gln',
        label: 'GLN',
        edit: {
          type: 'select',
          component: 'InputSelectCombo',
          options: glns.map(g => ({ value: g, label: g }))
        }
      },
      {
        property: 'app_metadata.glns',
        label: 'GLNs',
        edit: {
          type: 'select',
          component: 'InputMultiCombo',
          options: glns.map(g => ({ value: g, label: g }))
        }
      }
    ]
  });
}`;

// Based on the access hook docs example: no one can delete users, and admins can only access users in their own email domain
const ACCESS_DENIED_DELETE_MESSAGE = 'You are not allowed to delete users.';
const ACCESS_DENIED_DOMAIN_MESSAGE = 'You can only access users in your own email domain.';

const SAME_EMAIL_DOMAIN_ACCESS_HOOK = `function (ctx, callback) {
  if (ctx.payload.action === 'delete:user') {
    return callback(new Error('${ACCESS_DENIED_DELETE_MESSAGE}'));
  }

  var domain = ctx.request.user.email.split('@')[1];
  if (ctx.payload.user.email.split('@')[1] !== domain) {
    return callback(new Error('${ACCESS_DENIED_DOMAIN_MESSAGE}'));
  }

  return callback();
}`;

const MEMBERSHIPS = [ 'Finance', 'HR', 'IT' ];

const MEMBERSHIPS_HOOK = `function (ctx, callback) {
  return callback(null, { createMemberships: true, memberships: ${JSON.stringify(MEMBERSHIPS)} });
}`;

// DAE hides the memberships field when there's only one, and gives every new user that membership
const SINGLE_MEMBERSHIP_HOOK = `function (ctx, callback) {
  return callback(null, ['IT']);
}`;

// Matches the ScriptManager cache maxAge in server/lib/scriptmanager.js; each server instance caches hooks separately
const HOOK_CACHE_TTL_MS = 10000;

module.exports = {
  SAME_EMAIL_DOMAIN_FILTER_HOOK,
  CUSTOM_FIELDS_SETTINGS_HOOK,
  CUSTOM_FIELDS_WRITE_HOOK,
  GLN_OPTIONS,
  GLN_DROPDOWN_SETTINGS_HOOK,
  ACCESS_DENIED_DELETE_MESSAGE,
  ACCESS_DENIED_DOMAIN_MESSAGE,
  SAME_EMAIL_DOMAIN_ACCESS_HOOK,
  MEMBERSHIPS,
  MEMBERSHIPS_HOOK,
  SINGLE_MEMBERSHIP_HOOK,
  HOOK_CACHE_TTL_MS
};
