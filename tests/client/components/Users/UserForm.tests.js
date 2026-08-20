import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import _ from 'lodash';

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
    return render(
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

  const checkField = (queries, fieldName, labelValue) => {
    const label = queries.container.querySelector(`label[for="${fieldName}"]`);
    expect(label).to.not.equal(null);
    expect(label).to.have.trimmed.text(labelValue);
  };

  const checkFields = (queries, targets) => {
    const labels = queries.container.querySelectorAll('label[for]');
    expect(labels).to.have.length(Object.keys(targets).length);
    Object.keys(targets).forEach(target => checkField(queries, target, targets[target]));
  };

  it('should render', () => {
    const targets = {
      username: 'Username (required)',
      memberships: 'Memberships',
      connection: 'Connection (required)',
      password: 'Password (required)',
      repeatPassword: 'Repeat Password (required)',
      email: 'Email (required)'
    };

    const queries = renderComponent(everythingOptions);

    checkFields(queries, targets);

    // Check Buttons
    expect(queries.getAllByRole('button', { name: 'Cancel' })).to.have.length(1);
    expect(queries.getAllByRole('button', { name: 'Create' })).to.have.length(1);
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
        property: 'repeatPassword',
        create: true
      },
      {
        property: 'username',
        create: true
      }
    ];

    const queries = renderComponent(everythingWithCustomFields);

    checkFields(queries, targets);

    // Check Buttons
    expect(queries.getAllByRole('button', { name: 'Cancel' })).to.have.length(1);
    expect(queries.getAllByRole('button', { name: 'Create' })).to.have.length(1);
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
          property: 'repeatPassword',
          create: false
        },
        {
          property: 'username',
          create: false
        }
      ],
      hasConnection: 'connA'
    };

    const queries = renderComponent(nothingOptions);

    checkFields(queries, targets);

    // Check Buttons
    expect(queries.getAllByRole('button', { name: 'Cancel' })).to.have.length(1);
    expect(queries.getAllByRole('button', { name: 'Create' })).to.have.length(1);
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

    const queries = renderComponent(everythingWithCustomFields, languageDictionary);

    checkFields(queries, targets);

    // Check Buttons
    expect(queries.getAllByRole('button', { name: 'CancelButton' })).to.have.length(1);
    expect(queries.getAllByRole('button', { name: 'CreateButton' })).to.have.length(1);
  });

  it('should render based on languageDictionary but missing button labels', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const queries = renderComponent(everythingOptions, languageDictionary);

    expect(queries.getAllByRole('button', { name: 'Cancel' })).to.have.length(1);
    expect(queries.getAllByRole('button', { name: 'Create' })).to.have.length(1);
  });
});
