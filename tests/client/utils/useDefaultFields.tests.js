import _ from 'lodash';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import * as useDefaultFields from '../../../client/utils/useDefaultFields';

describe('Client-Utils-useDefaultFields', () => {

  describe('#useUsernameField', () => {
    const dummyConnections = [{ name: 'connA', options: { requires_username: true } }, {
      name: 'connB',
      options: { requires_username: true }
    }];
    const dummyConnectionsNoUsername = [{ name: 'connA' }, { name: 'connB' }];
    const hasSelectedConnection = 'connA';

    it('empty array population', () => {
      const fields = [];
      const target = [{
        property: 'username',
        label: 'Username',
        edit: {
          required: true,
          type: 'text'
        }
      }];

      useDefaultFields.useUsernameField(true, fields, dummyConnections, hasSelectedConnection, {});
      expect(fields).to.deep.equal(target);
    });

    it('empty array population skip username', () => {
      const fields = [];
      const target = [];

      useDefaultFields.useUsernameField(true, fields, dummyConnectionsNoUsername, hasSelectedConnection, {});
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array use username', () => {
      const fields = [{
        property: 'username',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];
      const target = [{
        property: 'username',
        label: 'Username',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];

      useDefaultFields.useUsernameField(false, fields, dummyConnections, hasSelectedConnection, {});
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array use username change label', () => {
      const fields = [{
        property: 'username',
        label: 'UsernameField',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];
      const target = [{
        property: 'username',
        label: 'UsernameField',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];

      useDefaultFields.useUsernameField(false, fields, dummyConnections, hasSelectedConnection, {});
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array edit false', () => {
      const fields = [{
        property: 'username',
        label: 'UsernameField',
        edit: false
      }];
      const target = [];

      useDefaultFields.useUsernameField(true, fields, dummyConnections, hasSelectedConnection, {});
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array skip username', () => {
      const fields = [{
        property: 'username',
        label: 'UsernameField',
        edit: true
      }];
      const target = [];

      useDefaultFields.useUsernameField(true, fields, dummyConnectionsNoUsername, hasSelectedConnection, {});
      expect(fields).to.deep.equal(target);
    });

  });

  describe('#useMembershipsField', () => {
    const memberships = ['memA', 'memB'];
    const hasMembership = 'memA';
    const createMemberships = () => 'nothing';
    const getDictValue = (val, defaultVal) => defaultVal;

    it('empty array population', () => {
      const fields = [];
      const target = [{
        property: 'memberships',
        label: 'Memberships',
        edit: {
          type: 'select',
          component: 'InputMultiCombo',
          options: memberships.map(m => ({ value: m, label: m }))
        }
      }];

      useDefaultFields.useMembershipsField(true, fields, hasMembership, memberships, createMemberships, getDictValue);
      expect(fields).to.deep.equal(target);
    });

    it('empty array population skip', () => {
      const fields = [];
      const target = [];

      useDefaultFields.useMembershipsField(true, fields, undefined, [], undefined, getDictValue);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'memberships',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];
      const target = [{
        property: 'memberships',
        label: 'MembershipsLabel',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      useDefaultFields.useMembershipsField(false, fields, undefined, [], createMemberships, () => 'MembershipsLabel');
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array change label', () => {
      const fields = [{
        property: 'memberships',
        label: 'UsernameField',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];
      const target = [{
        property: 'memberships',
        label: 'UsernameField',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];

      useDefaultFields.useMembershipsField(false, fields, hasMembership, memberships, createMemberships, getDictValue);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array edit false', () => {
      const fields = [{
        property: 'memberships',
        label: 'MembershipsLabel',
        edit: false
      }];
      const target = [];

      useDefaultFields.useMembershipsField(true, fields, hasMembership, memberships, createMemberships, getDictValue);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'memberships',
        label: 'MembershipsLabel',
        edit: true
      }];
      const target = [];

      useDefaultFields.useMembershipsField(true, fields, undefined, [], undefined, getDictValue);
      expect(fields).to.deep.equal(target);
    });

  });

  describe('#useConnectionsField', () => {
    const connections = [{ name: 'connA', options: { requires_username: true } }, {
      name: 'connB',
      options: { requires_username: true }
    }];
    const connection = [{ name: 'connA', options: { requires_username: true } }];

    it('empty array population', () => {
      const fields = [];
      const target = [{
        property: 'connection',
        label: 'Connection',
        edit: {
          required: true,
          type: 'select',
          component: 'InputCombo',
          options: connections.map(conn => ({ value: conn.name, text: conn.name })),
          onChange: undefined
        }
      }];

      useDefaultFields.useConnectionsField(true, fields, connections);
      expect(fields).to.deep.equal(target);
    });

    it('empty array population skip', () => {
      const fields = [];
      const target = [];

      useDefaultFields.useConnectionsField(true, fields, []);
      expect(fields).to.deep.equal(target);

      useDefaultFields.useConnectionsField(true, fields, connection);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'connection',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];
      const target = [{
        property: 'connection',
        label: 'Connection',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      useDefaultFields.useConnectionsField(false, fields, connections);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array change label', () => {
      const fields = [{
        property: 'connection',
        label: 'ConnectionsLabel',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];
      const target = [{
        property: 'connection',
        label: 'ConnectionsLabel',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];

      useDefaultFields.useConnectionsField(false, fields, connections);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array edit false', () => {
      const fields = [{
        property: 'connection',
        label: 'ConnectionsLabel',
        edit: false
      }];
      const target = [];

      useDefaultFields.useConnectionsField(true, fields, connections);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'connection',
        label: 'ConnectionsLabel',
        edit: true
      }];
      const target = [];

      useDefaultFields.useConnectionsField(true, fields, []);
      expect(fields).to.deep.equal(target);
    });

  });

  describe('#useDisabledConnectionField', () => {
    const connection = 'connA';
    const standardTarget = (type) => ({
      property: 'connection',
      label: 'Connection',
      [type]: {
        type: 'text',
        disabled: true
      }
    });

    it('empty array population', () => {
      const fields = [];
      const target = [standardTarget('edit')];

      useDefaultFields.useDisabledConnectionField(true, fields, connection);
      expect(fields).to.deep.equal(target);
    });

    it('empty array population skip', () => {
      const fields = [];
      const target = [];

      useDefaultFields.useDisabledConnectionField(true, fields);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'connection',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];
      const target = [standardTarget('create')];

      useDefaultFields.useDisabledConnectionField(false, fields, connection);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array change label', () => {
      const fields = [{
        property: 'connection',
        label: 'ConnectionsLabel',
        create: {
          type: 'select',
          component: 'InputCombo'
        }
      }];
      const target = [_.assign({}, standardTarget('create'), { label: 'ConnectionsLabel' })];

      useDefaultFields.useDisabledConnectionField(false, fields, connection);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array edit false', () => {
      const fields = [{
        property: 'connection',
        label: 'ConnectionsLabel',
        edit: false
      }];
      const target = [];

      useDefaultFields.useDisabledConnectionField(true, fields, connection);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'connection',
        label: 'ConnectionsLabel',
        edit: true
      }];
      const target = [];

      useDefaultFields.useDisabledConnectionField(true, fields);
      expect(fields).to.deep.equal(target);
    });

  });

  describe('#usePasswordFields', () => {

    it('empty array population', () => {
      const fields = [];
      const target = [{
        property: 'password',
        label: 'Password',
        edit: {
          required: true,
          type: 'password',
          component: 'InputText'
        }
      },
        {
          property: 'repeatPassword',
          label: 'Repeat Password',
          edit: {
            required: true,
            type: 'password',
            component: 'InputText'
          }
        }];

      useDefaultFields.usePasswordFields(true, fields);
      expect(fields[0].edit.validationFunction).to.equal(undefined);
      expect(fields[1].edit.validationFunction).to.be.a('function');
      delete fields[1].edit.validationFunction;
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'password',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }, {
        property: 'repeatPassword',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      const target = [{
        property: 'password',
        label: 'Password',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }, {
        property: 'repeatPassword',
        label: 'Repeat Password',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      useDefaultFields.usePasswordFields(false, fields);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array change label', () => {
      const fields = [{
        property: 'password',
        label: 'PasswordLabel',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }, {
        property: 'repeatPassword',
        label: 'Password2Label',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      const target = [{
        property: 'password',
        label: 'PasswordLabel',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }, {
        property: 'repeatPassword',
        label: 'Password2Label',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];
      useDefaultFields.usePasswordFields(false, fields);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array edit false', () => {
      const fields = [{
        property: 'password',
        edit: false
      }, {
        property: 'repeatPassword',
        edit: false
      }];
      const target = [];

      useDefaultFields.usePasswordFields(true, fields);
      expect(fields).to.deep.equal(target);
    });
  });

  describe('#useEmailField', () => {

    it('empty array population', () => {
      const fields = [];
      const target = [{
        property: 'email',
        label: 'Email',
        edit: {
          type: 'text',
          component: 'InputText',
          required: true
        }
      }];

      useDefaultFields.useEmailField(true, fields);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'email',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      const target = [{
        property: 'email',
        label: 'Email',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      useDefaultFields.useEmailField(false, fields);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array change label', () => {
      const fields = [{
        property: 'email',
        label: 'EmailLabel',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      const target = [{
        property: 'email',
        label: 'EmailLabel',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];
      useDefaultFields.useEmailField(false, fields);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array edit false', () => {
      const fields = [{
        property: 'email',
        edit: false
      }];
      const target = [];

      useDefaultFields.useEmailField(true, fields);
      expect(fields).to.deep.equal(target);
    });
  });

  describe('#useDisabledEmailField', () => {
    const standardTarget = (type) => ([{
      property: 'email',
      label: 'Email',
      [type]: {
        type: 'text',
        component: 'InputText',
        disabled: true
      }
    }]);

    it('empty array population', () => {
      const fields = [];

      useDefaultFields.useDisabledEmailField(true, fields);
      expect(fields).to.deep.equal(standardTarget('edit'));
    });

    it('pre populated array', () => {
      const fields = [{
        property: 'email',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      useDefaultFields.useDisabledEmailField(false, fields);
      expect(fields).to.deep.equal(standardTarget('create'));
    });

    it('pre populated array change label', () => {
      const fields = [{
        property: 'email',
        label: 'EmailLabel',
        create: {
          type: 'select',
          component: 'InputCombo',
          options: ['a', 'b']
        }
      }];

      const target = _.cloneDeep(standardTarget('create'));
      target[0].label = 'EmailLabel';

      useDefaultFields.useDisabledEmailField(false, fields);
      expect(fields).to.deep.equal(target);
    });

    it('pre populated array edit false', () => {
      const fields = [{
        property: 'email',
        edit: false
      }];
      const target = [];

      useDefaultFields.useDisabledEmailField(true, fields);
      expect(fields).to.deep.equal(target);
    });
  });

});