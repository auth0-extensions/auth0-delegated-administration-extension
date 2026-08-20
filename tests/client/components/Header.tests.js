import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import _ from 'lodash';
import { MemoryRouter } from 'react-router-dom';

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
    const styleSettings = options.styleSettings || { useAlt: false };

    return render(
      <MemoryRouter>
        <Header
          user={options.user === null ? null : fromJS(user)}
          getDictValue={getDictValue}
          accessLevel={accessLevel}
          issuer={issuer}
          onLogout={logout}
          onCssToggle={cssToggle}
          styleSettings={fromJS(styleSettings)}
          renderCssToggle={options.renderCssToggle}
          languageDictionary={options.languageDictionary}
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
  });

  const checkMenuLabel = (queries, text) => {
    const span = queries.container.querySelectorAll('span.username-text');
    expect(span).to.have.length(1);
    expect(span[0]).to.have.trimmed.text(text);
  };

  const checkLogoutMenuItem = (queries, text) => {
    const logoutLink = queries.container.querySelectorAll('a[role="menuitem"]');
    expect(logoutLink).to.have.length(1);
    expect(logoutLink[0]).to.have.trimmed.text(text);
  };

  const checkForAdminMenuItems = (queries, usersAndLogsText, configurationText) => {
    const links = queries.getAllByRole('link');
    expect(links).to.have.length(2);
    expect(links[0]).to.have.trimmed.text(usersAndLogsText);
    expect(links[1]).to.have.trimmed.text(configurationText);
  };

  const checkForCssToggleMenuItem = (queries, text) => {
    const links = queries.container.querySelectorAll('a[role="menuitem"]');
    expect(links).to.have.length(2);
    expect(links[0]).to.have.trimmed.text(text);
  };

  const checkForNoAdminMenuItems = (queries) => {
    expect(queries.queryAllByRole('link')).to.have.length(0);
  };

  it('should render admin', () => {
    const queries = renderComponent({ accessLevel: { role: 3 } });

    checkLogoutMenuItem(queries, 'Logout');
    checkForAdminMenuItems(queries, 'Users & Logs', 'Configuration');
  });

  it('should render logs-user', () => {
    const queries = renderComponent({ accessLevel: { role: 2 } });

    checkLogoutMenuItem(queries, 'Logout');
    checkForNoAdminMenuItems(queries);
  });

  it('should render non-admin', () => {
    const queries = renderComponent();

    checkLogoutMenuItem(queries, 'Logout');
    checkForNoAdminMenuItems(queries);
  });

  it('should render menuName from user.name', () => {
    const queries = renderComponent();

    checkMenuLabel(queries, 'bill');
  });

  it('should render menuName from user.nickname', () => {
    const user = _.cloneDeep(dummyUser);
    delete user.name;
    const queries = renderComponent({ user });

    checkMenuLabel(queries, 'bills nickname');
  });

  it('should render menuName from user.email', () => {
    const user = _.cloneDeep(dummyUser);
    delete user.name;
    delete user.nickname;
    const queries = renderComponent({ user });

    checkMenuLabel(queries, 'bill@somewhere.com');
  });

  it('should render menuName from issuer', () => {
    const user = _.cloneDeep(dummyUser);
    delete user.name;
    delete user.nickname;
    delete user.email;
    const queries = renderComponent({ user });

    checkMenuLabel(queries, 'issuer');
  });

  it('should render menuName from user.name truncate', () => {
    const queries = renderComponent({ user: longNameUser });

    checkMenuLabel(queries, 'bill_really_long_n...');
  });

  it('should render menuName from user.nickname truncate', () => {
    const user = _.cloneDeep(longNameUser);
    delete user.name;
    const queries = renderComponent({ user });

    checkMenuLabel(queries, 'bills nickname_rea...');
  });

  it('should render menuName from user.email truncate', () => {
    const user = _.cloneDeep(longNameUser);
    delete user.name;
    delete user.nickname;
    const queries = renderComponent({ user });

    checkMenuLabel(queries, 'bill@somewhere.com...');
  });

  it('should render menuName from issuer truncate', () => {
    const queries = renderComponent({ user: null, issuer: 'issuer_some_really_long_breaks_css' });

    checkMenuLabel(queries, 'issuer_some_really...');
  });

  it('should render admin languageDictionary', () => {
    const languageDictionary = {
      usersAndLogsMenuItemText: 'usersAndLogs',
      configurationMenuItemText: 'configurationText',
      logoutMenuItemText: 'logoutText'
    };

    const queries = renderComponent({
      accessLevel: { role: 3 },
      languageDictionary,
      getDictValue: () => 'menuName'
    });

    checkMenuLabel(queries, 'menuName');
    checkLogoutMenuItem(queries, 'logoutText');
    checkForAdminMenuItems(queries, 'usersAndLogs', 'configurationText');
  });

  it('should render non-admin languageDictionary', () => {
    const languageDictionary = {
      usersAndLogsMenuItemText: 'usersAndLogs',
      configurationMenuItemText: 'configurationText',
      logoutMenuItemText: 'logoutText'
    };

    const queries = renderComponent({
      languageDictionary,
      getDictValue: () => 'menuName_some_really_long_name_breaks_css'
    });

    checkMenuLabel(queries, 'menuName_some_real...');
    checkLogoutMenuItem(queries, 'logoutText');
    checkForNoAdminMenuItems(queries);
  });

  it('should render cssToggle menu item for nonAdmin', () => {
    const queries = renderComponent({ renderCssToggle: true, languageDictionary: { toggleStyleSetAlternative: 'Switch to Alternative' } });

    checkForCssToggleMenuItem(queries, 'Switch to Alternative');
  });

  it('should render cssToggle menu item for Admin', () => {
    const options = {
      accessLevel: { role: 2 },
      renderCssToggle: true,
      languageDictionary: { toggleStyleSetAlternative: 'Switch to Alternative' }
    };
    const queries = renderComponent(options);

    checkForCssToggleMenuItem(queries, 'Switch to Alternative');
  });
});
