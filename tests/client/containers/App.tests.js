import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { act, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import fakeStore from '../../utils/fakeStore';

import App from '../../../client/containers/App';
import rootReducer from '../../../client/reducers';
import { getAppSettings } from '../../../client/actions/auth';
import normalizeErrorMiddleware from '../../../client/middlewares/normalizeErrorMiddleware';
import promiseSuccessMiddleware from '../../../client/middlewares/promiseSuccessMiddleware';

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

  const renderComponent = (languageDictionary, settingsInitialized = true) => {
    const initialState = {
      accessLevel: fromJS({ record: { role: 1 } }),
      auth: fromJS({
        user: {},
        issuer: 'auth0'
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS({ loading: !settingsInitialized, initialized: settingsInitialized, record: { settings: {} } })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <MemoryRouter initialEntries={[ '/child' ]}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="child" element={<p id="child">Some Child</p>} />
            </Route>
          </Routes>
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

  it('should render the child route once settings are initialized', () => {
    const { container } = renderComponent();

    expect(container.querySelector('#child')).to.not.equal(null);
  });

  it('should not render the header or the child route before settings are initialized', () => {
    const { container } = renderComponent({}, false);

    expect(container.querySelector('header.dashboard-header')).to.equal(null);
    expect(container.querySelector('#child')).to.equal(null);
  });

  describe('settings loading with a real store', () => {
    let settingsResponses;
    let lifecycle;

    const respondToSettings = (status, data) => act(async () => {
      settingsResponses.shift()([ status, data ]);
    });

    function Child() {
      useEffect(() => {
        lifecycle.mounts += 1;
        return () => {
          lifecycle.unmounts += 1;
        };
      }, []);
      return <p id="child">Some Child</p>;
    }

    const renderWithStore = () => {
      const store = createStore(rootReducer, {
        auth: fromJS({ user: {}, issuer: 'auth0', isAuthenticated: true })
      }, applyMiddleware(promiseMiddleware, thunkMiddleware, normalizeErrorMiddleware(), promiseSuccessMiddleware()));

      const result = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[ '/child' ]}>
            <Routes>
              <Route path="/" element={<App />}>
                <Route path="child" element={<Child />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      return { store, ...result };
    };

    beforeEach(() => {
      settingsResponses = [];
      lifecycle = { mounts: 0, unmounts: 0 };
      // Hold every settings request open until the test answers it.
      stub.onGet('/api/settings').reply(() => new Promise((resolve) => settingsResponses.push(resolve)));
    });

    after(() => {
      stub.onGet('/api/settings').reply(200, {});
    });

    it('should mount the child route only once, after the initial settings load', async () => {
      const { container, store } = renderWithStore();

      expect(store.getState().settings.get('loading')).to.equal(true);
      expect(container.querySelector('#child')).to.equal(null);
      expect(lifecycle.mounts).to.equal(0);

      await waitFor(() => expect(settingsResponses).to.have.length(1));
      await respondToSettings(200, { settings: { dict: { title: 'Title' } } });

      await waitFor(() => expect(container.querySelector('#child')).to.not.equal(null));
      expect(lifecycle).to.deep.equal({ mounts: 1, unmounts: 0 });
    });

    it('should keep the child route mounted while settings are refreshed', async () => {
      const { container, store } = renderWithStore();

      await waitFor(() => expect(settingsResponses).to.have.length(1));
      await respondToSettings(200, { settings: { dict: { title: 'Title' } } });
      await waitFor(() => expect(container.querySelector('#child')).to.not.equal(null));

      // e.g. what happens after saving the settings script on the Configuration page
      act(() => {
        store.dispatch(getAppSettings());
      });
      expect(store.getState().settings.get('loading')).to.equal(true);
      expect(container.querySelector('#child')).to.not.equal(null);

      await waitFor(() => expect(settingsResponses).to.have.length(1));
      await respondToSettings(200, { settings: { dict: { title: 'New Title' } } });

      await waitFor(() => expect(store.getState().settings.get('loading')).to.equal(false));
      expect(container.querySelector('#child')).to.not.equal(null);
      expect(lifecycle).to.deep.equal({ mounts: 1, unmounts: 0 });
    });

    it('should still render the child route if the initial settings load fails', async () => {
      const { container, store } = renderWithStore();

      await waitFor(() => expect(settingsResponses).to.have.length(1));
      await respondToSettings(500, { message: 'boom' });

      await waitFor(() => expect(container.querySelector('#child')).to.not.equal(null));
      expect(store.getState().settings.get('error')).to.not.equal(null);
      expect(lifecycle).to.deep.equal({ mounts: 1, unmounts: 0 });
    });
  });
});
