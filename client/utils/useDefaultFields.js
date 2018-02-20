import _ from 'lodash';

const applyDefaults = (type, fields, property, defaults) => {
  const field = _.find(fields, { property });

  if (field) {
    if (_.isBoolean(field[type]) && field[type] === false)
      return _.remove(fields, { property });
    return _.defaults(field, defaults);
  }
  return fields.unshift(defaults);
};

export const useUsernameField = (isEditField, fields, connections, hasSelectedConnection, initialValues) => {
  const type = isEditField ? 'edit' : 'create';
  const selectedConnection = _.find(connections, (conn) => conn.name === hasSelectedConnection);
  const requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
  if (!requireUsername && (!initialValues || !initialValues.username)) {
    return _.remove(fields, { property: 'username' });
  }

  const defaults = {
    property: 'username',
    label: 'Username',
    [type]: {
      type: 'text',
      required: true
    }
  };

  return applyDefaults(type, fields, 'username', defaults);
};

export const useMembershipsField = (isEditField, fields, hasMembership, memberships, createMemberships, getDictValue) => {
  const type = isEditField ? 'edit' : 'create';
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
    [type]: {
      type: 'select',
      component: 'InputMultiCombo',
      options: allMemberships.map(m => ({ value: m, label: m }))
    }
  };

  return applyDefaults(type, fields, 'memberships', defaults);
};

export const useConnectionsField = (isEditField, fields, connections, onConnectionChange) => {
  const type = isEditField ? 'edit' : 'create';
  if (!connections || connections.length <= 1) {
    return _.remove(fields, { property: 'connection' });
  }

  const defaults = {
    property: 'connection',
    label: 'Connection',
    [type]: {
      required: true,
      type: 'select',
      component: 'InputCombo',
      options: connections.map(conn => ({ value: conn.name, label: conn.name })),
      onChange: onConnectionChange
    }
  };

  return applyDefaults(type, fields, 'connection', defaults);
};

export const useDisabledConnectionField = (isEditField, fields, connection) => {
  const type = isEditField ? 'edit' : 'create';
  if (!connection) {
    return _.remove(fields, { property: 'connection' });
  }

  const defaults = {
    property: 'connection',
    label: 'Connection',
    [type]: {
      type: 'text',
      disabled: true
    }
  };

  applyDefaults(type, fields, 'connection', defaults);

  const field = _.find(fields, { property: 'connection' });
  // If connection is an editable field, we need to display it on other pages, but only as disabled
  if (field && (
      (_.isObject(field[type]) && field[type].disabled !== true) || _.isBoolean(field[type])
    )) field[type] = defaults[type];
};

export const usePasswordFields = (isEditField, fields) => {
  const type = isEditField ? 'edit' : 'create';
  const repeatPasswordDefaults = {
    property: 'repeatPassword',
    label: 'Repeat Password',
    [type]: {
      required: true,
      type: 'password',
      component: 'InputText',
      validationFunction:
        (value, values) =>
          (value !== values.password ? 'passwords must match' : false )
    }
  };

  const passwordDefaults = {
    property: 'password',
    label: 'Password',
    [type]: {
      required: true,
      type: 'password',
      component: 'InputText'
    }
  };

  applyDefaults(type, fields, 'repeatPassword', repeatPasswordDefaults);
  applyDefaults(type, fields, 'password', passwordDefaults);
};

export const useEmailField = (isEditField, fields) => {
  const type = isEditField ? 'edit' : 'create';
  const defaults = {
    property: 'email',
    label: 'Email',
    [type]: {
      type: 'text',
      component: 'InputText',
      required: true
    }
  };

  applyDefaults(type, fields, 'email', defaults);
};

export const useClientField = (isEditField, fields, clients) => {
  const type = isEditField ? 'edit' : 'create';
  const defaults = {
    property: 'client',
    label: 'Client',
    [type]: {
      type: 'select',
      component: 'InputCombo',
      required: true,
      options: clients.map(option => ({ value: option.client_id, label: option.name}))
    }
  };

  applyDefaults(type, fields, 'client', defaults);
};

export const useDisabledEmailField = (isEditField, fields) => {
  const type = isEditField ? 'edit' : 'create';
  const defaults = {
    property: 'email',
    label: 'Email',
    [type]: {
      type: 'text',
      component: 'InputText',
      disabled: true
    }
  };

  applyDefaults(type, fields, 'email', defaults);

  const field = _.find(fields, { property: 'email' });
  // If connection is an editable field, we need to display it on other pages, but only as disabled
  if (field && (
      (_.isObject(field[type]) && field[type].disabled !== true) || _.isBoolean(field[type])
    )) field[type] = defaults[type];
};
