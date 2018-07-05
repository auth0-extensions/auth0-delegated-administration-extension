import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { TabPane } from 'auth0-extension-ui';
import TabsHeader from '../../../client/components/TabsHeader';

describe('#Client-Components-TabsHeader', () => {
  const renderComponent = (role, languageDictionary) => {

    return shallow(
      <TabsHeader
        role={role}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const checkPanes = (component, userTitle, logsTitle) => {
    const numTabs = logsTitle ? 2 : 1;
    const tabs = component.find(TabPane);
    expect(tabs.length).to.equal(numTabs);
    expect(tabs.at(0).prop('title')).to.equal(userTitle);
    if (numTabs > 1) expect(tabs.at(1).prop('title')).to.equal(logsTitle);
  };

  it('should render admin', () => {
    const component = renderComponent(2);

    expect(component.length).to.be.greaterThan(0);
    checkPanes(component, 'Users', 'Logs');
  });

  it('should render non-admin', () => {
    const component = renderComponent(1);

    expect(component.length).to.be.greaterThan(0);

    checkPanes(component, 'Users');
  });

  it('should render tab names from languageDictionary for admin', () => {
    const component = renderComponent(2, {
      userUsersTabTitle: 'Users Title',
      userLogsTabTitle: 'Logs Title'
    });

    expect(component.length).to.be.greaterThan(0);

    checkPanes(component, 'Users Title', 'Logs Title');
  });

  it('should render tab names from languageDictionary for non-admin', () => {
    const component = renderComponent(1, {
      userUsersTabTitle: 'Users Title',
      userLogsTabTitle: 'Logs Title'
    });

    expect(component.length).to.be.greaterThan(0);

    checkPanes(component, 'Users Title');
  });
});
