import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Router, Route, createMemoryHistory } from 'react-router';

import fakeStore from '../../../utils/fakeStore';

import User from '../../../../client/containers/Users/User';
import TabsHeader from '../../../../client/components/TabsHeader';
import LogDialog from '../../../../client/components/Logs/LogDialog';
import LogsTable from '../../../../client/components/Logs/LogsTable';
import { UserActions, UserDevices, UserHeader, UserProfile, UserInfo } from '../../../../client/components/Users';

import { Tab } from 'react-bootstrap';


const memoryHistory = createMemoryHistory({});

let wrapper = undefined;
const wrapperMount = (...args) => (wrapper = mount(...args));

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
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <Router history={memoryHistory}>
          <Route path="/" component={UserWrapper}/>
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
    checkForLanguageDictionary(component, UserActions, languageDictionary);
    checkForLanguageDictionary(component, UserHeader, languageDictionary);
    checkForLanguageDictionary(component, UserInfo, languageDictionary);
    checkForLanguageDictionary(component, UserDevices, languageDictionary);
    checkForLanguageDictionary(component, LogDialog, languageDictionary);
    checkForLanguageDictionary(component, LogsTable, languageDictionary);
    checkForLanguageDictionary(component, UserProfile, languageDictionary);
    checkForLanguageDictionary(component, TabsHeader, languageDictionary);
  };

  const checkTabs = (component, userInfoTitle, devicesTitle, logsTitle, profileTitle) => {
    const tabs = component.find(Tab);
    expect(tabs.length).to.equal(4);
    expect(tabs.at(0).prop('title')).to.equal(userInfoTitle);
    expect(tabs.at(1).prop('title')).to.equal(devicesTitle);
    expect(tabs.at(2).prop('title')).to.equal(logsTitle);
    expect(tabs.at(3).prop('title')).to.equal(profileTitle);
  };

  const checkTitle = (component, title) => {
    const titleObject = component.find('h1');
    expect(titleObject.length).to.equal(1);
    expect(titleObject.text()).to.equal(title);
  };

  it('should render', () => {
    const component = renderComponent();

    checkAllComponentsForLanguageDictionary(component, {});
    checkTabs(component, 'User Information', 'Devices', 'Logs', 'Profile');
    checkTitle(component, 'User Details');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary(component, { someKey: 'someValue' });
    checkTabs(component, 'User Information', 'Devices', 'Logs', 'Profile');
    checkTitle(component, 'User Details');
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

    checkAllComponentsForLanguageDictionary(component, languageDictionary);
    checkTabs(component, 'User Info Title', 'Devices Title', 'Logs Title', 'Profile Title');
    checkTitle(component, 'User Details Title');
  });
});
