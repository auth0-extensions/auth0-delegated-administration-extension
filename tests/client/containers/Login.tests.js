import React  from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../utils/fakeStore';

import Login from '../../../client/containers/Login';
import { Confirm } from 'auth0-extension-ui';

let wrapper = undefined;
const wrapperMount = (...args) => (wrapper = mount(...args));

describe('#Client-Containers-Login', () => {

  const renderComponent = (error, languageDictionary) => {
    const initialState = {
      accessLevel: fromJS({ record: { role: 1 } }),
      auth: fromJS({
        isAuthenticated: false,
        isAuthenticating: true,
        user: {},
        issuer: 'auth0',
        error
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS({ loading: false, record: { settings: {} } })
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <Login></Login>
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

  const checkErrorConfirm = (component, confirmTitle, confirmButtonText) => {
    const confirm = component.find(Confirm);
    if (confirmTitle) {
      expect(confirm.length).to.equal(1);
      expect(confirm.prop('confirmMessage')).to.equal(confirmButtonText);
      expect(confirm.prop('title')).to.equal(confirmTitle);
    } else {
      expect(confirm.length).to.equal(0);
    }
  };

  it('should render', () => {
    const component = renderComponent();

    checkErrorConfirm(component);
  });

  it('should render error confirm', () => {
    const component = renderComponent('some error');

    checkErrorConfirm(component, 'Login Error', 'Login');
  });

  it('should render error confirm not applicable language dictionary', () => {
    const component = renderComponent('some error', { someKey: 'someValue' });

    checkErrorConfirm(component, 'Login Error', 'Login');
  });

  it('should render error confirm applicable language dictionary', () => {
    const languageDictionary = {
      loginErrorTitle: 'Login Error Title',
      loginErrorButtonText: 'Login Button'
    };

    const component = renderComponent('Some Error', languageDictionary);

    checkErrorConfirm(component, 'Login Error Title', 'Login Button');
  });
});
