import React  from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../utils/fakeStore';

import Login from '../../../client/containers/Login';

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
    return render(
      <Provider store={fakeStore(initialState)}>
        <Login></Login>
      </Provider>
    );
  };

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const checkErrorConfirm = (container, confirmTitle, confirmButtonText) => {
    const confirm = document.body.querySelectorAll('.login-error');
    if (confirmTitle) {
      expect(confirm.length).to.equal(1);
      expect(confirm[0].querySelector('.modal-title')).to.have.trimmed.text(confirmTitle);
      expect(confirm[0].querySelector('.button-confirm')).to.have.trimmed.text(confirmButtonText);
    } else {
      expect(confirm.length).to.equal(0);
    }
  };

  it('should render', () => {
    const component = renderComponent();

    checkErrorConfirm(component.container);
  });

  it('should render error confirm', () => {
    const component = renderComponent('some error');

    checkErrorConfirm(component.container, 'Login Error', 'Login');
  });

  it('should render error confirm not applicable language dictionary', () => {
    const component = renderComponent('some error', { someKey: 'someValue' });

    checkErrorConfirm(component.container, 'Login Error', 'Login');
  });

  it('should render error confirm applicable language dictionary', () => {
    const languageDictionary = {
      loginErrorTitle: 'Login Error Title',
      loginErrorButtonText: 'Login Button'
    };

    const component = renderComponent('Some Error', languageDictionary);

    checkErrorConfirm(component.container, 'Login Error Title', 'Login Button');
  });
});
