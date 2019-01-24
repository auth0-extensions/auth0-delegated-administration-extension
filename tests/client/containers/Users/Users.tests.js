import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Router, Route, createMemoryHistory } from 'react-router';

import fakeStore from '../../../utils/fakeStore';

import Users from '../../../../client/containers/Users/Users';
import TabsHeader from '../../../../client/components/TabsHeader';
import UserOverview from '../../../../client/components/Users/UserOverview';

// import { Pagination, TableTotals } from 'auth0-extension-ui';

const memoryHistory = createMemoryHistory({});
let wrapper = undefined;
const wrapperMount = (...args) => (wrapper = mount(...args));

class UsersWrapper extends Component {
  render() {
    return <Users
    />
  }
}

describe('#Client-Containers-Users-Users', () => {

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
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <Router history={memoryHistory}>
          <Route path="/" component={UsersWrapper}/>
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
});
