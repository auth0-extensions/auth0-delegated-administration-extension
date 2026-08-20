import React  from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it} from 'mocha';
import { fromJS } from 'immutable';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

import fakeStore from '../../utils/fakeStore';

import App from '../../../client/containers/App';

describe('#Client-Containers-App', () => {
  let stub;

  before(() => {
    // mock api calls from App > componentWillMount
    stub = new MockAdapter(axios);
    stub.onGet('/api/applications').reply(200, []);
    stub.onGet('/api/settings').reply(200, {});
    stub.onGet('/api/connections').reply(200, []);
    stub.onGet('/api/me').reply(200, {});
  });

  after(() => {
      stub.restore();
  });

  const renderComponent = (languageDictionary) => {
    const initialState = {
      accessLevel: fromJS({ record: { role: 1 } }),
      auth: fromJS({
        user: {},
        issuer: 'auth0'
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS({ loading: false, record: { settings: {} } })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <MemoryRouter>
          <App><p>Some Child</p></App>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const checkForLanguageDictionary = (component, languageDictionary) => {
    expect(component).to.not.equal(null);
    const logout = component.querySelector('a[role="menuitem"]');
    expect(logout.textContent.trim()).to.equal(languageDictionary.logoutMenuItemText || 'Logout');
  };

  const checkAllComponentsForLanguageDictionary = (container, languageDictionary) => {
    checkForLanguageDictionary(container.querySelector('header.dashboard-header'), languageDictionary);
  };

  it('should render', () => {
    const { container } = renderComponent();

    checkAllComponentsForLanguageDictionary(container, {});
  });

  it('should render not applicable language dictionary', () => {
    const { container } = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary(container, { someKey: 'someValue' });
  });
});
