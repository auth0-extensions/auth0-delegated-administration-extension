import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { act, fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { fromJS } from 'immutable';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import proxyquire from 'proxyquire';

import fakeStore from '../../../utils/fakeStore';
import rootReducer from '../../../../client/reducers';
import { refreshUser } from '../../../../client/actions/user';
import normalizeErrorMiddleware from '../../../../client/middlewares/normalizeErrorMiddleware';
import promiseSuccessMiddleware from '../../../../client/middlewares/promiseSuccessMiddleware';

/* Record the props each child component receives so we can assert what User passes down. */
let captured = {};
const StubChild = (name) => (props) => {
  captured[name] = (captured[name] || []).concat(props);
  return null;
};

const User = proxyquire('../../../../client/containers/Users/User', {
  '../../components/TabsHeader': { '__esModule': true, default: StubChild('TabsHeader') },
  '../../components/Logs/LogDialog': { '__esModule': true, default: StubChild('LogDialog') },
  '../../components/Logs/LogsTable': { '__esModule': true, default: StubChild('LogsTable') },
  '../../components/Users': {
    UserActions: StubChild('UserActions'),
    UserDevices: StubChild('UserDevices'),
    UserHeader: StubChild('UserHeader'),
    UserProfile: StubChild('UserProfile'),
    UserInfo: StubChild('UserInfo')
  }
}).default;

class UserWrapper extends Component {
  render() {
    return <User
      accessLevel={{ role: 1 }}
      params={{ id: 1 }}
      getDictValue={() => null}
      userDelete={() => null}
    />;
  }
};

describe('#Client-Containers-Users-User', () => {

  const renderComponent = (languageDictionary) => {
    const basicUsername = fromJS({
      user: { name: 'bill' },
      loading: false,
      error: null
    });
    const initialState = {
      userDelete: basicUsername,
      emailChange: basicUsername,
      passwordReset: basicUsername,
      passwordChange: basicUsername,
      usernameChange: basicUsername,
      verificationEmail: basicUsername,
      block: basicUsername,
      unblock: basicUsername,
      removeBlockedIPs: basicUsername,
      mfa: basicUsername,
      applications: fromJS({ records: [] }),
      connections: fromJS({ records: [] }),
      fieldsChange: fromJS({}),
      accessLevel: { role: 1 },
      user: fromJS({
        loading: false,
        error: null,
        record: {
          identities: [ {
            provider: 'auth0',
            connection: 'connA'
          } ]
        },
        devices: {
          loading: false,
          records: [],
          error: null
        },
        logs: {
          error: null,
          loading: false,
          records: {}
        }
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      log: fromJS({
        error: null,
        loading: false,
        record: {},
        logId: null
      }),
      settings: fromJS({ record: { settings: {} } })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <MemoryRouter initialEntries={[ '/' ]} initialIndex={0}>
          <Routes>
            <Route path="/" element={<UserWrapper/>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    captured = {};
    document.body.innerHTML = '';
  });

  const checkForLanguageDictionary = (componentName, languageDictionary) => {
    const subComponent = captured[componentName] || [];
    expect(subComponent.length).to.equal(1);
    expect(subComponent[0].languageDictionary).to.deep.equal(languageDictionary);
  };

  const checkAllComponentsForLanguageDictionary = (languageDictionary) => {
    checkForLanguageDictionary('UserActions', languageDictionary);
    checkForLanguageDictionary('UserHeader', languageDictionary);
    checkForLanguageDictionary('UserInfo', languageDictionary);
    checkForLanguageDictionary('UserDevices', languageDictionary);
    checkForLanguageDictionary('LogDialog', languageDictionary);
    checkForLanguageDictionary('LogsTable', languageDictionary);
    checkForLanguageDictionary('UserProfile', languageDictionary);
    checkForLanguageDictionary('TabsHeader', languageDictionary);
  };

  const checkTabs = (container, userInfoTitle, devicesTitle, logsTitle, profileTitle) => {
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).to.equal(4);
    expect(tabs[0]).to.have.trimmed.text(userInfoTitle);
    expect(tabs[1]).to.have.trimmed.text(devicesTitle);
    expect(tabs[2]).to.have.trimmed.text(logsTitle);
    expect(tabs[3]).to.have.trimmed.text(profileTitle);
  };

  const checkTitle = (container, title) => {
    const titleObject = container.querySelectorAll('h1');
    expect(titleObject.length).to.equal(1);
    expect(titleObject[0]).to.have.trimmed.text(title);
  };

  it('should render', () => {
    const component = renderComponent();

    checkAllComponentsForLanguageDictionary({});
    checkTabs(component.container, 'User Information', 'Devices', 'Logs', 'Profile');
    checkTitle(component.container, 'User Details');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary({ someKey: 'someValue' });
    checkTabs(component.container, 'User Information', 'Devices', 'Logs', 'Profile');
    checkTitle(component.container, 'User Details');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      userUserInfoTabTitle: 'User Info Title',
      userDevicesTabTitle: 'Devices Title',
      userLogsTabTitle: 'Logs Title',
      userProfileTabTitle: 'Profile Title',
      userTitle: 'User Details Title'
    };
    const component = renderComponent(languageDictionary);

    checkAllComponentsForLanguageDictionary(languageDictionary);
    checkTabs(component.container, 'User Info Title', 'Devices Title', 'Logs Title', 'Profile Title');
    checkTitle(component.container, 'User Details Title');
  });

  describe('lazy loading of the tabs with a real store', () => {
    let mock;
    let store;

    const requestedUrls = () => mock.history.get.map(request => request.url);
    // Let axios hand the requests to the adapter and the responses reach the store.
    const flush = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));

    const userResponse = (userId) => ({ user: { user_id: userId, identities: [ { connection: 'connA' } ] }, memberships: [], connection: {} });
    const replyUser = (userId) => {
      mock.onGet(`/api/users/${userId}`).reply(200, userResponse(userId));
      mock.onGet(`/api/users/${userId}/logs`).reply(200, [ { _id: `log_${userId}`, date: '2016-09-26T13:03:50.703Z', type: 's' } ]);
      mock.onGet(`/api/users/${userId}/devices`).reply(200, { devices: [ { device_name: `device_${userId}` } ] });
    };

    const UserPage = ({ id }) => (
      <User accessLevel={{ role: 1 }} params={{ id }} getDictValue={() => null} />
    );

    const renderWithStore = (id) => {
      const ui = (userId) => (
        <Provider store={store}>
          <MemoryRouter>
            <UserPage id={userId} />
          </MemoryRouter>
        </Provider>
      );
      const result = render(ui(id));
      return { ...result, navigateTo: userId => result.rerender(ui(userId)) };
    };

    const selectTab = (container, name) => {
      const tab = Array.from(container.querySelectorAll('[role="tab"]')).find(el => el.textContent.trim() === name);
      fireEvent.click(tab);
    };

    const lastProps = name => captured[name][captured[name].length - 1];

    beforeEach(() => {
      mock = new MockAdapter(axios);
      replyUser('user_1');
      replyUser('user_2');
      store = createStore(rootReducer, {
        settings: fromJS({ loading: false, initialized: true, record: { settings: {} } })
      }, applyMiddleware(promiseMiddleware, thunkMiddleware, normalizeErrorMiddleware(), promiseSuccessMiddleware()));
    });

    afterEach(() => {
      mock.restore();
    });

    it('should only fetch the user details on load', async () => {
      renderWithStore('user_1');
      await flush();

      expect(requestedUrls()).to.deep.equal([ '/api/users/user_1' ]);
      expect(store.getState().user.getIn([ 'record', 'user_id' ])).to.equal('user_1');
      // Not requested yet: the lazy tabs show a loading state instead of "no logs/devices".
      expect(lastProps('UserDevices').loading).to.equal(true);
      expect(lastProps('LogsTable').loading).to.equal(true);
    });

    it('should fetch the devices once, when the Devices tab is first opened', async () => {
      const { container } = renderWithStore('user_1');
      await flush();

      selectTab(container, 'Devices');
      selectTab(container, 'Devices');
      await flush();
      selectTab(container, 'User Information');
      selectTab(container, 'Devices');
      await flush();

      expect(requestedUrls()).to.deep.equal([ '/api/users/user_1', '/api/users/user_1/devices' ]);
      expect(lastProps('UserDevices').loading).to.equal(false);
      expect(lastProps('UserDevices').devices.toJS()).to.deep.equal({ device_user_1: 1 });
      expect(container.querySelector('[role="tab"][aria-selected="true"]')).to.have.trimmed.text('Devices');
    });

    it('should fetch the logs once, when the Logs tab is first opened', async () => {
      const { container } = renderWithStore('user_1');
      await flush();

      selectTab(container, 'Logs');
      selectTab(container, 'Logs');
      await flush();
      selectTab(container, 'Profile');
      selectTab(container, 'Logs');
      await flush();

      expect(requestedUrls()).to.deep.equal([ '/api/users/user_1', '/api/users/user_1/logs' ]);
      expect(lastProps('LogsTable').loading).to.equal(false);
      expect(lastProps('LogsTable').logs.toJS().map(log => log._id)).to.deep.equal([ 'log_user_1' ]);
    });

    it('should not fetch again while the request is still pending', async () => {
      mock.onGet('/api/users/user_1/logs').reply(() => new Promise(() => {}));
      const { container } = renderWithStore('user_1');
      await flush();

      selectTab(container, 'Logs');
      await flush();
      selectTab(container, 'User Information');
      selectTab(container, 'Logs');
      await flush();

      expect(requestedUrls()).to.deep.equal([ '/api/users/user_1', '/api/users/user_1/logs' ]);
      expect(lastProps('LogsTable').loading).to.equal(true);
    });

    it('should show a failed load in the tab only and retry it when the tab is opened again', async () => {
      let devicesRequests = 0;
      mock.onGet('/api/users/user_1/devices').reply(() => {
        devicesRequests += 1;
        return devicesRequests === 1 ? [ 403, { message: 'Forbidden' } ] : [ 200, { devices: [ { device_name: 'device_user_1' } ] } ];
      });
      const { container } = renderWithStore('user_1');
      await flush();

      selectTab(container, 'Devices');
      await flush();

      expect(lastProps('UserDevices').loading).to.equal(false);
      expect(lastProps('UserDevices').error.toJS()).to.deep.equal({ type: 'FETCH_USER_DEVICES', message: 'Forbidden', status: 403 });
      expect(store.getState().user.get('error')).to.equal(null);
      expect(lastProps('UserInfo').user.get('user_id')).to.equal('user_1');

      selectTab(container, 'User Information');
      selectTab(container, 'Devices');
      await flush();

      expect(requestedUrls()).to.deep.equal([ '/api/users/user_1', '/api/users/user_1/devices', '/api/users/user_1/devices' ]);
      expect(lastProps('UserDevices').error).to.equal(null);
      expect(lastProps('UserDevices').devices.toJS()).to.deep.equal({ device_user_1: 1 });
    });

    it('should load the new user when the route id changes', async () => {
      const { container, navigateTo } = renderWithStore('user_1');
      await flush();
      selectTab(container, 'Logs');
      selectTab(container, 'Devices');
      await flush();

      navigateTo('user_2');
      await flush();

      expect(requestedUrls()).to.deep.equal([
        '/api/users/user_1', '/api/users/user_1/logs', '/api/users/user_1/devices', '/api/users/user_2'
      ]);
      expect(container.querySelector('[role="tab"][aria-selected="true"]')).to.have.trimmed.text('User Information');
      expect(lastProps('UserInfo').user.get('user_id')).to.equal('user_2');
      // The previous user's logs/devices are gone.
      expect(lastProps('LogsTable').loading).to.equal(true);
      expect(lastProps('LogsTable').logs.size).to.equal(0);
      expect(lastProps('UserDevices').loading).to.equal(true);
      expect(lastProps('UserDevices').devices.size).to.equal(0);

      selectTab(container, 'Logs');
      await flush();

      expect(requestedUrls().slice(4)).to.deep.equal([ '/api/users/user_2/logs' ]);
      expect(lastProps('LogsTable').logs.toJS().map(log => log._id)).to.deep.equal([ 'log_user_2' ]);
    });

    it('should not show logs of the previous user that arrive after navigating away', async () => {
      let respondUser1Logs;
      mock.onGet('/api/users/user_1/logs').reply(() => new Promise(resolve => {
        respondUser1Logs = resolve;
      }));
      const { container, navigateTo } = renderWithStore('user_1');
      await flush();
      selectTab(container, 'Logs');
      await flush();

      navigateTo('user_2');
      await flush();
      respondUser1Logs([ 200, [ { _id: 'log_user_1', date: '2016-09-26T13:03:50.703Z', type: 's' } ] ]);
      await flush();

      expect(store.getState().user.get('logs').toJS()).to.deep.equal({ loading: false, error: null, userId: null, records: [] });
    });

    it('should load the details again (but not the tabs) when the same user page is opened again', async () => {
      renderWithStore('user_1').unmount();
      await flush();
      const { container } = renderWithStore('user_1');
      await flush();

      selectTab(container, 'Logs');
      await flush();

      expect(requestedUrls()).to.deep.equal([ '/api/users/user_1', '/api/users/user_1', '/api/users/user_1/logs' ]);
    });

    it('should refresh the details and only the already loaded tabs after a fields change', async () => {
      const { container } = renderWithStore('user_1');
      await flush();
      selectTab(container, 'Logs');
      await flush();

      await act(async () => {
        store.dispatch(refreshUser('user_1'));
      });
      await flush();

      expect(requestedUrls()).to.deep.equal([ '/api/users/user_1', '/api/users/user_1/logs', '/api/users/user_1', '/api/users/user_1/logs' ]);
      expect(lastProps('LogsTable').logs.toJS().map(log => log._id)).to.deep.equal([ 'log_user_1' ]);
    });
  });
});
