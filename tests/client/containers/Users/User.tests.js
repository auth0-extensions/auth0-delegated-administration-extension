import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { fromJS } from 'immutable';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import proxyquire from 'proxyquire';

import fakeStore from '../../../utils/fakeStore';

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
    />
  }
};

describe('#Client-Containers-Users-User', () => {

  const renderComponent = (languageDictionary) => {
    const basicUsername = fromJS({
      user: {name: 'bill'},
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
      applications: fromJS({ records: []}),
      connections: fromJS({ records: []}),
      fieldsChange: fromJS({}),
      accessLevel: { role: 1 },
      user: fromJS({
        loading: false,
        error: null,
        record: {
          identities: [{
            provider: 'auth0',
            connection: 'connA'
          }]
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
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
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
});
