import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import moment from 'moment';
import _ from 'lodash';

import { fromJS } from 'immutable';
import UserInfo from '../../../../client/components/Users/UserInfo';
import UserInfoField from '../../../../client/components/Users/UserInfoField';

describe('#Client-Components-UserInfo', () => {

  const renderComponent = (user, userFields, memberships, languageDictionary) => {
    return shallow(
      <UserInfo
        error={null}
        loading={false}
        user={fromJS(user)}
        memberships={memberships}
        userFields={userFields}
        settings={{}}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const checkField = (fields, index, title, value) => {
    const thisField = fields.filterWhere(element =>
      element.key() === index.toString());
    expect(thisField.length > 0 ? thisField.prop('title') : 'No Title').to.equal(title);
    expect(thisField.length > 0 ? thisField.childAt(0).text() : 'No Value').to.equal(value);
  };

  const checkFields = (component, targets) => {
    const fields = component.find(UserInfoField);

    //expect(fields.length).to.equal(Object.keys(targets).length);

    for (let i = 0; i < targets.length; i++) {
      checkField(fields, i, targets[i].title, targets[i].value);
    }
  };

  it('should render', () => {
    const targets = _.sortBy([
      { title: 'User ID', value: '1' },
      { title: 'Name', value: 'name' },
      { title: 'Username', value: 'username' },
      { title: 'Email', value: 'email@nowhere.com' },
      { title: 'Identity', value: 'connA' },
      { title: 'Blocked', value: 'No' },
      { title: 'Last IP', value: '127.0.0.1' },
      { title: 'Logins Count', value: '12' },
      { title: 'Memberships', value: 'a, b' },
      { title: 'Signed Up', value: 'a day ago' },
      { title: 'Updated', value: 'a day ago' },
      { title: 'Last Login', value: 'a day ago' }
    ], 'title');

    const user = {
      user_id: 1,
      name: 'name',
      username: 'username',
      email: 'email@nowhere.com',
      identities: [{
        connection: 'connA'
      }],
      isBlocked: false,
      last_ip: '127.0.0.1',
      logins_count: 12,
      created_at: moment().add(-1, 'days'),
      updated_at: moment().add(-1, 'days'),
      last_login: moment().add(-1, 'days')
    };

    const component = renderComponent(user, null, ['a', 'b']);

    expect(component.length).to.be.greaterThan(0);

    checkFields(component, targets);
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      momentLocale: 'fr',
      trueLabel: 'TRUE THAT',
      falseLabel: 'FALSY',
      yesLabel: 'YES SIR',
      noLabel: 'Nope'
    };

    const targets = _.sortBy([
      { title: 'User ID', value: '1' },
      { title: 'Name', value: 'name' },
      { title: 'Username', value: 'username' },
      { title: 'Email', value: 'email@nowhere.com' },
      { title: 'Identity', value: 'connA' },
      { title: 'Blocked', value: 'Nope' },
      { title: 'Last IP', value: '127.0.0.1' },
      { title: 'Logins Count', value: '12' },
      { title: 'Memberships', value: 'a, b' },
      { title: 'Signed Up', value: 'il y a un jour' },
      { title: 'Updated', value: 'il y a un jour' },
      { title: 'Last Login', value: 'il y a un jour' },
      { title: 'Some Boolean', value: 'TRUE THAT' }
    ], 'title');

    const user = {
      user_id: 1,
      name: 'name',
      username: 'username',
      email: 'email@nowhere.com',
      identities: [{
        connection: 'connA'
      }],
      isBlocked: false,
      last_ip: '127.0.0.1',
      logins_count: 12,
      created_at: moment().add(-1, 'days'),
      updated_at: moment().add(-1, 'days'),
      last_login: moment().add(-1, 'days'),
      user_metadata: { someBoolean: true }
    };

    const component = renderComponent(user,
      [{ label: 'Some Boolean', property: 'user_metadata.someBoolean', display: true }],
      ['a', 'b'],
      languageDictionary);

    expect(component.length).to.be.greaterThan(0);

    checkFields(component, targets);
  });

  it('should render based on custom fields', () => {
    const targets = _.sortBy([
      { title: 'User ID1', value: '1' },
      { title: 'Name1', value: 'name' },
      { title: 'Username1', value: 'username' },
      { title: 'Email1', value: 'email@nowhere.com' },
      { title: 'Identity1', value: 'connA' },
      { title: 'Blocked1', value: 'some display func' },
      { title: 'Last IP1', value: '127.0.0.1' },
      { title: 'Logins Count1', value: '12' },
      { title: 'Memberships1', value: 'a, b' },
      { title: 'Signed Up1', value: 'some display func' },
      { title: 'Updated1', value: 'some display func' },
      { title: 'Last Login1', value: 'some display func' },
      { title: 'Some Boolean', value: 'some display func' },
      { title: 'Some Other Boolean', value: 'some display func' }
    ], 'title');

    const displayFunc = (user) => 'some display func';

    const userFields = [
      { label: 'User ID1', property: 'user_id', display: true },
      { label: 'Name1', property: 'name', display: true },
      { label: 'Username1', property: 'username', display: true },
      { label: 'Email1', property: 'email', display: true },
      { label: 'Identity1', property: 'identity.connection', display: true },
      { label: 'Blocked1', property: 'isBlocked', display: displayFunc },
      { label: 'Last IP1', property: 'last_ip', display: true },
      { label: 'Logins Count1', property: 'logins_count', display: true },
      { label: 'Memberships1', property: 'currentMemberships', display: true },
      { label: 'Signed Up1', property: 'created_at', display: displayFunc },
      { label: 'Updated1', property: 'updated_at', display: displayFunc },
      { label: 'Last Login1', property: 'last_login', display: displayFunc },
      { label: 'Some Boolean', property: 'user_metadata.someBoolean', display: displayFunc },
      { label: 'Some Other Boolean', property: 'user_metadata.someOtherBoolean', display: displayFunc }
    ];

    const user = {
      user_id: 1,
      name: 'name',
      user_metadata: {
        someBoolean: false,
        someOtherBoolean: true
      },
      username: 'username',
      email: 'email@nowhere.com',
      identities: [{
        connection: 'connA'
      }],
      isBlocked: false,
      last_ip: '127.0.0.1',
      logins_count: 12,
      created_at: moment().add(-1, 'days'),
      updated_at: moment().add(-1, 'days'),
      last_login: moment().add(-1, 'days')
    };

    const component = renderComponent(user, userFields, ['a', 'b']);

    expect(component.length).to.be.greaterThan(0);

    checkFields(component, targets);
  });
});
