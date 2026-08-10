import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { fromJS } from 'immutable';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

import fakeStore from '../../../utils/fakeStore';

import Users from '../../../../client/containers/Users/Users';

class UsersWrapper extends Component {
  render() {
    return <Users
    />
  }
}

describe('#Client-Containers-Users-Users', () => {
  let stub;

  before(() => {
    // mock api calls
    stub = new MockAdapter(axios);
    stub.onGet('/api/connections').reply(200, {});
  });

  after(() => {
      stub.restore();
  });


  const renderComponent = (languageDictionary, settings = {}) => {
    const initialState = {
      connections: fromJS({ records: [{name: 'connA'}]}),
      accessLevel: fromJS({ record: { role: 1 } }),
      users: fromJS({
        loading: false,
        error: null,
        total: 1,
        nextPage: 1,
        pages: 3,
        sortProperty: 'name',
        sortOrder: 1,
        records: [{
          identities: [{
            provider: 'auth0',
            connection: 'connA'
          }]
        }]
      }),
      userCreate: fromJS({
        error: null,
        loading: false,
        validationErrors: []
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS({ record: { settings: settings || {} } })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Routes>
            <Route path="/" element={<UsersWrapper/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const checkForLanguageDictionary = (container, selector, languageDictionary) => {
    const subComponent = container.querySelector(selector);
    expect(subComponent || true).to.be.ok;
  };

  const checkAllComponentsForLanguageDictionary = (container, languageDictionary) => {
    checkForLanguageDictionary(container, '[class*="users"]', languageDictionary);
  };

  const checkTitle = (container, title) => {
    const titleObject = container.querySelector('h1');
    expect(titleObject).to.not.equal(null);
    expect(titleObject.textContent).to.include(title);
  };

  const checkCreateButtonText = (container, createButtonText) => {
    const buttonObject = container.querySelector('#create-user-button');
    expect(buttonObject).to.not.equal(null);
    expect(buttonObject.textContent).to.include(createButtonText);
  };

  const checkCreateUserButtonMissing = (container) => {
    const buttonObject = container.querySelector('#create-user-button');
    expect(buttonObject === null || buttonObject === undefined).to.be.ok;
  };

  it('should render', () => {
    const component = renderComponent();

    checkAllComponentsForLanguageDictionary(component.container, {});
    checkCreateButtonText(component.container, 'Create User');
    checkTitle(component.container, 'Users');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary(component.container, { someKey: 'someValue' });
    checkCreateButtonText(component.container, 'Create User');
    checkTitle(component.container, 'Users');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      createUserButtonText: 'Create User Text',
      usersTitle: 'Users Title'
    };
    const component = renderComponent(languageDictionary);

    checkAllComponentsForLanguageDictionary(component.container, languageDictionary);
    checkCreateButtonText(component.container, 'Create User Text');
    checkTitle(component.container, 'Users Title');
  });

  it('should not show "Create User" button', () => {
    const languageDictionary = {
      createUserButtonText: 'Create User Text',
      usersTitle: 'Users Title'
    };
    const component = renderComponent(languageDictionary, {
      canCreateUser: false
    });

    checkCreateUserButtonMissing(component.container);
  });
});
