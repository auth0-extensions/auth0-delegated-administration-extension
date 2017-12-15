import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import _ from 'lodash';

import { Field } from 'redux-form';
import { Button } from 'react-bootstrap';
import fakeStore from '../../../utils/fakeStore';
import UserForm from '../../../../client/components/Users/UserForm';

describe('#Client-Components-UserForm', () => {
  const everythingOptions = {
    connections: [
      {
        name: 'connA', options: { requires_username: true }
      },
      {
        name: 'connB', options: { requires_username: false }
      }],
    memberships: ['a', 'b', 'c'],
    hasConnection: 'connA',
    hasMembership: ['a', 'b']
  };

  const renderComponent = (options, languageDictionary) => {
    options = options || {};
    const initialState = {
      form: {
        user: {
          values: {
            connection: options.hasConnection,
            memberships: options.hasMembership
          }
        }
      }
    };
    return mount(
      <Provider store={fakeStore(initialState)}>
        <UserForm
          connections={options.connections}
          memberships={options.memberships}
          customFields={options.customFields}
          getDictValue={options.getDictValue || ((key, defaultValue) => defaultValue)}
          onClose={() => 'onClose'}
          handleSubmit={() => 'handleSubmit'}
          customFieldGetter={() => 'customFieldGetter'}
          submitting={false}
          languageDictionary={languageDictionary}
        />
      </Provider>
    );
  };

  beforeEach(() => {
  });

  const checkField = (fields, fieldName, labelValue) => {
    const thisField = fields.filterWhere(element =>
      element.prop('name') === fieldName);
    expect(thisField.length > 0 ? thisField.prop('name') : 'Not Found').to.equal(fieldName);
    expect(thisField.prop('label')).to.equal(labelValue);
  };

  const checkFields = (component, targets) => {
    const fields = component.find(Field);

    expect(fields.length).to.equal(Object.keys(targets).length);
    Object.keys(targets).forEach(target => checkField(fields, target, targets[target]));
  };

  it('should render', () => {
    const targets = {
      username: 'Username',
      memberships: 'Memberships',
      connection: 'Connection',
      password: 'Password',
      repeatPassword: 'Repeat Password',
      email: 'Email'
    };

    const component = renderComponent(everythingOptions);

    expect(component.length).to.be.greaterThan(0);

    checkFields(component, targets);

    // Check Buttons
    expect(component.find(Button).filterWhere(element =>
      element.text() === 'Cancel').length).to.equal(1);
    expect(component.find(Button).filterWhere(element => element.text() === 'Create').length).to.equal(1);
  });

  it('should render connection, email, password, memberships if create is true', () => {
    const targets = {
      username: 'Username',
      memberships: 'Memberships',
      connection: 'Connection',
      password: 'Password',
      repeatPassword: 'Repeat Password',
      email: 'Email'
    };

    const everythingWithCustomFields = _.cloneDeep(everythingOptions);
    everythingWithCustomFields.customFields = [
      {
        property: 'connection',
        create: true
      },
      {
        property: 'email',
        create: true
      },
      {
        property: 'password',
        create: true
      },
      {
        property: 'username',
        create: true
      }
    ];

    const component = renderComponent(everythingWithCustomFields);

    expect(component.length).to.be.greaterThan(0);

    checkFields(component, targets);

    // Check Buttons
    expect(component.find(Button).filterWhere(element =>
      element.text() === 'Cancel').length).to.equal(1);
    expect(component.find(Button).filterWhere(element => element.text() === 'Create').length).to.equal(1);
  });

  it('should not render connection, email, password, memberships if create is false', () => {
    const targets = {
    };

    const nothingOptions = {
      connections: [
        {
          name: 'connA', options: { requires_username: true }
        },
        {
          name: 'connB', options: { requires_username: false }
        }],
      memberships: [],
      customFields: [
        {
          property: 'connection',
          create: false
        },
        {
          property: 'email',
          create: false
        },
        {
          property: 'password',
          create: false
        },
        {
          property: 'username',
          create: false
        }
      ],
      hasConnection: 'connA'
    };

    const component = renderComponent(nothingOptions);

    expect(component.length).to.be.greaterThan(0);

    checkFields(component, targets);

    // Check Buttons
    expect(component.find(Button).filterWhere(element =>
      element.text() === 'Cancel').length).to.equal(1);
    expect(component.find(Button).filterWhere(element => element.text() === 'Create').length).to.equal(1);
  });

  it('should render labels based on customFields and dict values', () => {
    const languageDictionary = {
      createButtonText: 'CreateButton',
      cancelButtonText: 'CancelButton'
    }

    const targets = {
      username: 'UsernameLabel',
      memberships: 'MembershipsLabel',
      connection: 'ConnectionLabel',
      password: 'PasswordLabel',
      repeatPassword: 'RepeatPasswordLabel',
      email: 'EmailLabel'
    };

    const everythingWithCustomFields = _.cloneDeep(everythingOptions);
    everythingWithCustomFields.customFields = [
      {
        property: 'connection',
        label: 'ConnectionLabel',
        create: true
      },
      {
        property: 'email',
        label: 'EmailLabel',
        create: true
      },
      {
        property: 'password',
        label: 'PasswordLabel',
        create: true
      },
      {
        property: 'repeatPassword',
        label: 'RepeatPasswordLabel',
        create: true
      },
      {
        property: 'username',
        label: 'UsernameLabel',
        create: true
      }
    ];
    everythingWithCustomFields.getDictValue = () => 'MembershipsLabel';

    const component = renderComponent(everythingWithCustomFields, languageDictionary);

    expect(component.length).to.be.greaterThan(0);

    checkFields(component, targets);

    // Check Buttons
    expect(component.find(Button).filterWhere(element => element.text() === 'CancelButton').length).to.equal(1);
    expect(component.find(Button).filterWhere(element => element.text() === 'CreateButton').length).to.equal(1);
  });

  it('should render based on languageDictionary but missing button labels', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const Component = renderComponent(languageDictionary);

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find(Button).filterWhere(element => element.text() === 'Cancel').length).to.equal(1);
    expect(Component.find(Button).filterWhere(element => element.text() === 'Create').length).to.equal(1);
  });
});
