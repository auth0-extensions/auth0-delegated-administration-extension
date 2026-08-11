import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Router, Route, createMemoryHistory } from 'react-router';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

import fakeStore from '../../../utils/fakeStore';

import UsersContainer from '../../../../client/containers/Users/Users';
import TabsHeader from '../../../../client/components/TabsHeader';
import UserOverview from '../../../../client/components/Users/UserOverview';

// import { Pagination, TableTotals } from 'auth0-extension-ui';

const memoryHistory = createMemoryHistory({});
let wrapper = undefined;
const wrapperMount = (...args) => (wrapper = mount(...args));


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

  const renderComponent = (languageDictionary, settings = {}, route = '/users') => {
    memoryHistory.push(route);
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
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <Router history={memoryHistory}>
          <Route path="/users" component={UsersContainer} />
        </Router>
      </Provider>
    );
  };

  beforeEach(() => {
    wrapper = undefined;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) wrapper.unmount();
  });

  const checkForLanguageDictionary = (component, componentType, languageDictionary) => {
    const subComponent = component.find(componentType);
    expect(subComponent.length).to.equal(1);
    expect(subComponent.prop('languageDictionary')).to.deep.equal(languageDictionary);
  };

  const checkAllComponentsForLanguageDictionary = (component, languageDictionary) => {
    checkForLanguageDictionary(component, UserOverview, languageDictionary);
    checkForLanguageDictionary(component, TabsHeader, languageDictionary);
  };

  const checkTitle = (component, title) => {
    const titleObject = component.find('h1');
    expect(titleObject.length).to.equal(1);
    expect(titleObject.text()).to.equal(title);
  };

  const checkCreateButtonText = (component, createButtonText) => {
    const buttonObject = component.find('#create-user-button');
    expect(buttonObject.length).to.equal(1);
    expect(buttonObject.text()).to.equal(createButtonText);
  };

  const checkCreateUserButtonMissing = (component) => {
    const buttonObject = component.find('#create-user-button');
    expect(buttonObject.length).to.equal(0);
  };

  const checkSearchValidationError = (component, message) => {
    const userOverview = component.find(UserOverview);
    expect(userOverview.length).to.equal(1);
    expect(userOverview.prop('error')).to.deep.equal({
      searchValidation: true,
      message
    });
  };

  const checkNoSearchValidationError = (component) => {
    const userOverview = component.find(UserOverview);
    expect(userOverview.length).to.equal(1);
    expect(userOverview.prop('error')).to.equal(null);
  };

  it('should render', () => {
    const component = renderComponent();

    checkAllComponentsForLanguageDictionary(component, {});
    checkCreateButtonText(component, 'Create User');
    checkTitle(component, 'Users');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary(component, { someKey: 'someValue' });
    checkCreateButtonText(component, 'Create User');
    checkTitle(component, 'Users');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      createUserButtonText: 'Create User Text',
      usersTitle: 'Users Title'
    };
    const component = renderComponent(languageDictionary);

    checkAllComponentsForLanguageDictionary(component, languageDictionary);
    checkCreateButtonText(component, 'Create User Text');
    checkTitle(component, 'Users Title');
  });

  it('should not show "Create User" button', () => {
    const languageDictionary = {
      createUserButtonText: 'Create User Text',
      usersTitle: 'Users Title'
    };
    const component = renderComponent(languageDictionary, {
      canCreateUser: false
    });

    checkCreateUserButtonMissing(component);
  });

  it('should fetch users using a valid Lucene search query from the URL', () => {
    stub.onGet('/api/users').reply((config) => {
      expect(config.params.search).to.equal('email:"john@doe.com"');
      return [200, { users: [], total: 0 }];
    });
    const component = renderComponent({}, {}, '/users?search=email%3A%22john%40doe.com%22');
    checkNoSearchValidationError(component);
  });

  it('should fetch users when the URL has no search query', () => {
    stub.onGet('/api/users').reply((config) => {
      expect(config.params.search).to.equal('');
      return [200, { users: [], total: 0 }];
    });
    const component = renderComponent();
    checkNoSearchValidationError(component);
  });

  it('should fetch users using a field search from the URL when filterable user fields are configured', () => {
    stub.onGet('/api/users').reply((config) => {
      expect(config.params.search).to.equal('134');
      expect(config.params.filterBy).to.equal('app_metadata.contactId');
      return [200, { users: [], total: 0 }];
    });
    const component = renderComponent(
      {},
      {
        userFields: [
          {
            label: 'Contact ID',
            property: 'app_metadata.contactId',
            search: { filter: true }
          }
        ]
      },
      '/users?search=134&filterBy=app_metadata.contactId'
    );
    checkNoSearchValidationError(component);
  });

  it('should show an error for an invalid lucene search query from the URL', () => {
    const component = renderComponent({}, {}, '/users?search=foo)%20OR%20(user_id%3Aevil');
    checkSearchValidationError(component, 'Invalid Lucene search syntax');
  });

  it('should show an error for a stale field search URL when filterBy is no longer configured', () => {
    const component = renderComponent(
      {},
      {
        userFields: [
          {
            label: 'Contact ID',
            property: 'app_metadata.contactId',
            search: { filter: true }
          }
        ]
      },
      '/users?search=134&filterBy=app_metadata.removed'
    );
    checkSearchValidationError(
      component,
      'Unsupported filter field in the URL "app_metadata.removed"'
    );
  });

  it('should show an error when a field search URL omits filterBy', () => {
    const component = renderComponent(
      {},
      {
        userFields: [
          {
            label: 'Contact ID',
            property: 'app_metadata.contactId',
            search: { filter: true }
          }
        ]
      },
      '/users?search=134'
    );
    checkSearchValidationError(
      component,
      'Filter field is required when search term is present in the URL'
    );
  });
});
