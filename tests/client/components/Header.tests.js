import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import _ from 'lodash';

import { Link } from 'react-router';

import Header from '../../../client/components/Header';

describe('#Client-Components-Header', () => {
  const logout = () => 'onLogout';
  const cssToggle = () => 'cssToggle';
  const defaultGetDictValue = (key, defaultValue) => defaultValue;
  const dummyUser = {
    name: 'bill',
    nickname: 'bills nickname',
    email: 'bill@somewhere.com'
  };

  const longNameUser = {
    name: 'bill_really_long_name_breaks_css',
    nickname: 'bills nickname_really_long_name_breaks_css',
    email: 'bill@somewhere.com_really_long_name_breaks_css'
  };

  const renderComponent = (options) => {

    options = options || {};
    const getDictValue = options.getDictValue || defaultGetDictValue;
    const user = options.user || dummyUser;
    const accessLevel = options.accessLevel || {};
    const issuer = options.issuer || 'issuer';
    const renderCssToggle = options.cssToggle || false;

    return shallow(
      <Header
        user={options.user === null ? null : fromJS(user)}
        getDictValue={getDictValue}
        accessLevel={accessLevel}
        issuer={issuer}
        onLogout={logout}
        onCssToggle={cssToggle}
        renderCssToggle={options.renderCssToggle}
        languageDictionary={options.languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const checkMenuLabel = (component, text) => {
    const span = component.find('span.username-text');
    expect(span.length).to.equal(1);
    expect(span.text()).to.equal(text);
  };

  const checkLogoutMenuItem = (component, text) => {
    const logoutLink = component.find('a[role="menuitem"]');
    expect(logoutLink.length).to.equal(1);
    expect(logoutLink.text()).to.equal(text);
  };

  const checkForAdminMenuItems = (component, usersAndLogsText, configurationText) => {
    const links = component.find(Link);
    expect(links.length).to.equal(2);
    expect(links.at(0).childAt(0).text()).to.equal(usersAndLogsText);
    expect(links.at(1).childAt(0).text()).to.equal(configurationText);
  };

  const checkForCssToggleMenuItem = (component, text) => {
    const links = component.find('a[role="menuitem"]');
    expect(links.length).to.equal(2);
    expect(links.at(0).text()).to.equal(text);
  };

  const checkForNoAdminMenuItems = (component) => {
    const links = component.find(Link);
    expect(links.length).to.equal(0);
  };

  it('should render admin', () => {
    const component = renderComponent({ accessLevel: { role: 2 } });

    expect(component.length).to.be.greaterThan(0);

    checkLogoutMenuItem(component, 'Logout');
    checkForAdminMenuItems(component, 'Users & Logs', 'Configuration');
  });

  it('should render non-admin', () => {
    const component = renderComponent();

    expect(component.length).to.be.greaterThan(0);

    checkLogoutMenuItem(component, 'Logout');
    checkForNoAdminMenuItems(component);
  });

  it('should render menuName from user.name', () => {
    const component = renderComponent();

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'bill');
  });

  it('should render menuName from user.nickname', () => {
    const user = _.cloneDeep(dummyUser);
    delete user.name;
    const component = renderComponent({ user });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'bills nickname');
  });

  it('should render menuName from user.email', () => {
    const user = _.cloneDeep(dummyUser);
    delete user.name;
    delete user.nickname;
    const component = renderComponent({ user });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'bill@somewhere.com');
  });

  it('should render menuName from issuer', () => {
    const user = _.cloneDeep(dummyUser);
    delete user.name;
    delete user.nickname;
    delete user.email;
    const component = renderComponent({ user });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'issuer');
  });

  it('should render menuName from user.name truncate', () => {
    const component = renderComponent({ user: longNameUser });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'bill_really_long_n...');
  });

  it('should render menuName from user.nickname truncate', () => {
    const user = _.cloneDeep(longNameUser);
    delete user.name;
    const component = renderComponent({ user });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'bills nickname_rea...');
  });

  it('should render menuName from user.email truncate', () => {
    const user = _.cloneDeep(longNameUser);
    delete user.name;
    delete user.nickname;
    const component = renderComponent({ user });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'bill@somewhere.com...');
  });

  it('should render menuName from issuer truncate', () => {
    const component = renderComponent({ user: null, issuer: 'issuer_some_really_long_breaks_css' });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'issuer_some_really...');
  });

  it('should render admin languageDictionary', () => {
    const languageDictionary = {
      usersAndLogsMenuItemText: 'usersAndLogs',
      configurationMenuItemText: 'configurationText',
      logoutMenuItemText: 'logoutText'
    };

    const component = renderComponent({
      accessLevel: { role: 2 },
      languageDictionary,
      getDictValue: () => 'menuName'
    });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'menuName');
    checkLogoutMenuItem(component, 'logoutText');
    checkForAdminMenuItems(component, 'usersAndLogs', 'configurationText');
  });

  it('should render non-admin languageDictionary', () => {
    const languageDictionary = {
      usersAndLogsMenuItemText: 'usersAndLogs',
      configurationMenuItemText: 'configurationText',
      logoutMenuItemText: 'logoutText'
    };

    const component = renderComponent({
      languageDictionary,
      getDictValue: () => 'menuName_some_really_long_name_breaks_css'
    });

    expect(component.length).to.be.greaterThan(0);

    checkMenuLabel(component, 'menuName_some_real...');
    checkLogoutMenuItem(component, 'logoutText');
    checkForNoAdminMenuItems(component);
  });

  it('should render cssToggle menu item for nonAdmin', () => {
    const component = renderComponent({ renderCssToggle: true, languageDictionary: { toggleStyleSetAlternative: 'Switch to Alternative' } });

    expect(component.length).to.be.greaterThan(0);

    checkForCssToggleMenuItem(component, 'Switch to Alternative');
  });

  it('should render cssToggle menu item for Admin', () => {
    const options = {
      accessLevel: { role: 2 },
      renderCssToggle: true,
      languageDictionary: { toggleStyleSetAlternative: 'Switch to Alternative' }
    };
    const component = renderComponent(options);

    expect(component.length).to.be.greaterThan(0);

    checkForCssToggleMenuItem(component, 'Switch to Alternative');
  });
});
