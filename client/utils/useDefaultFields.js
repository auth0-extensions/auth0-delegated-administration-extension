export const useUsernameField = (fields, connections, hasSelectedConnection, initialValues) => {
  const selectedConnection = _.find(connections, (conn) => conn.name === hasSelectedConnection);
  const requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
  if (!requireUsername && (!initialValues || !initialValues.username)) {
    return _.remove(fields, { property: 'username' });
  }

  const defaults = {
    property: 'username',
    label: 'Username',
    create: true
  };

  const usernameField = _.find(fields, { property: 'username' });
  if (usernameField) return _.defaults(usernameField, defaults);
  return fields.unshift(defaults);
};

export const useMembershipsField = (fields, hasMembership, memberships, createMemberships, getDictValue) => {
  const allMemberships = _(memberships || [])
    .concat(hasMembership)
    .uniq()
    .sort()
    .value();

  if (allMemberships.length <= 1 && !createMemberships) {
    return _.remove(fields, { property: 'memberships' });
  }

  const defaults = {
    property: 'memberships',
    label: getDictValue('memberships', 'Memberships'),
    create: {
      type: 'select',
      component: 'InputMultiCombo',
      options: allMemberships.map(m => ({ value: m, label: m }))
    }
  };

  const index = _.findIndex(fields, 'property', 'memberships');
  if (index >= 0) return _.defaults(fields[index], defaults);

  fields.unshift(defaults);
};

export const useConnectionsField = (fields, connections, onConnectionChange) => {
  if (!connections || connections.length <= 1) {
    return _.remove(fields, (field) => field.property === 'connection');
  }

  const defaults = {
    property: 'connection',
    label: 'Connection',
    create: {
      type: 'select',
      component: 'InputCombo',
      options: connections.map(conn => ({ value: conn.name, text: conn.name })),
      onChange: onConnectionChange
    }
  };

  const field = _.find(fields, { property: 'connection' });
  if (field) return _.defaults(field, defaults);
  fields.unshift(defaults);
};

export const usePasswordFields = (fields) => {
  const defaults = {
    create: {
      type: 'password',
      component: 'InputText'
    }
  };

  const repeatPasswordField = _.find(fields, { property: 'repeatPassword' });
  const repeatDefaults = _.assign({}, defaults, { validationFunction: (value, values) => (value !== values.password ? 'passwords must match' : false ) });
  if (repeatPasswordField) {
    _.defaults(repeatPasswordField, { property: 'repeatPassword', label: 'Repeat Password' }, repeatDefaults);
  } else {
    fields.unshift(_.assign({}, { property: 'repeatPassword', label: 'Repeat Password' }, repeatDefaults));
  }

  const passwordField = _.find(fields, { property: 'password' });
  if (passwordField) {
    _.defaults(passwordField, { property: 'password', label: 'Password' }, defaults);
  } else {
    fields.unshift(_.assign({}, { property: 'password', label: 'Password' }, defaults));
  }
};

export const useEmailField = (fields) => {
  const defaults = {
    property: 'email',
    label: 'Email',
    create: {
      type: 'text',
      component: 'InputText',
      required: true
    }
  };

  const field = _.find(fields, { property: 'email' });
  if (field) return _.defaults(field, defaults);
  fields.unshift(defaults);
};
