import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import UserDevices from '../../../../client/components/Users/UserDevices';
import { TableRow, TableTextCell, TableHeader, TableColumn } from 'auth0-extension-ui';

describe('#Client-Components-UserDevices', () => {

  const renderComponent = (user, devices, languageDictionary) => {
    return shallow(
      <UserDevices
        loading={false}
        error={null}
        devices={fromJS(devices)}
        user={fromJS(user)}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  it('should render', () => {
    const Component = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      { phone: 5, desktop: 2 }
    );

    expect(Component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = Component.find(TableHeader);
    expect(header.length).to.equal(1);
    const columns = header.find(TableColumn);
    expect(columns.length).to.equal(3);
    expect(columns.filterWhere(element =>
      element.childAt(0).text() === 'Device').length).to.equal(1);
    expect(columns.filterWhere(element =>
      element.childAt(0).text() === '# of Tokens/Public Keys').length).to.equal(1);

    /* Test the rows */
    const phoneRow = Component.find(TableRow).filterWhere(element => element.key() === 'phone');
    expect(phoneRow.length).to.equal(1);
    const phoneColumns = phoneRow.find(TableTextCell);
    expect(phoneColumns.length).to.equal(2);
    expect(phoneColumns.at(0).childAt(0).text()).to.equal('phone');
    expect(phoneColumns.at(1).childAt(0).text()).to.equal('5');

    const desktopRow = Component.find(TableRow).filterWhere(element => element.key() === 'desktop');
    expect(desktopRow.length).to.equal(1);
    const desktopColumns = desktopRow.find(TableTextCell);
    expect(desktopColumns.length).to.equal(2);
    expect(desktopColumns.at(0).childAt(0).text()).to.equal('desktop');
    expect(desktopColumns.at(1).childAt(0).text()).to.equal('2');
  });

  it('should render no devices', () => {
    const Component = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      {}
    );

    expect(Component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = Component.find(TableHeader);
    expect(header.length).to.equal(0);

    expect(Component.text()).to.equal('This user does not have any registered devices.');
  });

  it('should render partial languageDictionary', () => {
    const Component = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      { phone: 5, desktop: 2 },
      { someKey: 'someField' }
    );

    expect(Component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = Component.find(TableHeader);
    expect(header.length).to.equal(1);
    const columns = header.find(TableColumn);
    expect(columns.length).to.equal(3);
    expect(columns.filterWhere(element =>
      element.childAt(0).text() === 'Device').length).to.equal(1);
    expect(columns.filterWhere(element =>
      element.childAt(0).text() === '# of Tokens/Public Keys').length).to.equal(1);

    /* Test the rows */
    const phoneRow = Component.find(TableRow).filterWhere(element => element.key() === 'phone');
    expect(phoneRow.length).to.equal(1);
    const phoneColumns = phoneRow.find(TableTextCell);
    expect(phoneColumns.length).to.equal(2);
    expect(phoneColumns.at(0).childAt(0).text()).to.equal('phone');
    expect(phoneColumns.at(1).childAt(0).text()).to.equal('5');

    const desktopRow = Component.find(TableRow).filterWhere(element => element.key() === 'desktop');
    expect(desktopRow.length).to.equal(1);
    const desktopColumns = desktopRow.find(TableTextCell);
    expect(desktopColumns.length).to.equal(2);
    expect(desktopColumns.at(0).childAt(0).text()).to.equal('desktop');
    expect(desktopColumns.at(1).childAt(0).text()).to.equal('2');
  });

  it('should render no devices partial languageDictionary', () => {
    const Component = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      {},
      { someKey: 'someField' }
    );

    expect(Component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = Component.find(TableHeader);
    expect(header.length).to.equal(0);

    expect(Component.text()).to.equal('This user does not have any registered devices.');
  });

  it('should render real languageDictionary', () => {
    const Component = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      { phone: 5, desktop: 2 },
      {
        deviceNameColumnHeader: 'DeviceColumnHeader',
        deviceNumberTokensColumnHeader: 'DeviceNumberTokensColumnHeader',
        noDevicesMessage: 'Some No Device Message'
      }
    );

    expect(Component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = Component.find(TableHeader);
    expect(header.length).to.equal(1);
    const columns = header.find(TableColumn);
    expect(columns.length).to.equal(3);
    expect(columns.filterWhere(element =>
      element.childAt(0).text() === 'DeviceColumnHeader').length).to.equal(1);
    expect(columns.filterWhere(element =>
      element.childAt(0).text() === 'DeviceNumberTokensColumnHeader').length).to.equal(1);
  });

  it('should render no devices real languageDictionary', () => {
    const Component = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      {},
      {
        deviceNameColumnHeader: 'DeviceColumnHeader',
        deviceNumberTokensColumnHeader: 'DeviceNumberTokensColumnHeader',
        noDevicesMessage: 'Some No Device Message'
      }
    );

    expect(Component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = Component.find(TableHeader);
    expect(header.length).to.equal(0);

    expect(Component.text()).to.equal('Some No Device Message');
  });



});
