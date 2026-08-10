import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import UserDevices from '../../../../client/components/Users/UserDevices';

describe('#Client-Components-UserDevices', () => {

  const renderComponent = (user, devices, languageDictionary) => {
    return render(
      <UserDevices
        loading={false}
        error={null}
        devices={fromJS(devices)}
        user={fromJS(user)}
        settings={{}}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  it('should render', () => {
    const queries = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      { phone: 5, desktop: 2 }
    );

    /* Test the header */
    const columns = queries.getAllByRole('columnheader');
    expect(columns).to.have.length(3);
    expect(columns[0].children).to.have.length(0);
    expect(columns[1]).to.have.trimmed.text('Device');
    expect(columns[2]).to.have.trimmed.text('# of Tokens/Public Keys');

    /* Test the rows */
    const phoneCells = within(queries.getByRole('row', { name: /phone/ })).getAllByRole('cell');
    expect(phoneCells).to.have.length(3); // 1 icon + 2 text cells
    expect(phoneCells[1]).to.have.trimmed.text('phone');
    expect(phoneCells[2]).to.have.trimmed.text('5');

    const desktopCells = within(queries.getByRole('row', { name: /desktop/ })).getAllByRole('cell');
    expect(desktopCells).to.have.length(3);
    expect(desktopCells[1]).to.have.trimmed.text('desktop');
    expect(desktopCells[2]).to.have.trimmed.text('2');
  });

  it('should render no devices', () => {
    const queries = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      {}
    );

    expect(queries.queryAllByRole('columnheader')).to.have.length(0);
    expect(queries.getByText('This user does not have any registered devices.')).to.exist;
  });

  it('should render partial languageDictionary', () => {
    const queries = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      { phone: 5, desktop: 2 },
      { someKey: 'someField' }
    );

    /* Test the header */
    const columns = queries.getAllByRole('columnheader');
    expect(columns).to.have.length(3);
    expect(columns[0].children).to.have.length(0);
    expect(columns[1]).to.have.trimmed.text('Device');
    expect(columns[2]).to.have.trimmed.text('# of Tokens/Public Keys');

    /* Test the rows */
    const phoneCells = within(queries.getByRole('row', { name: /phone/ })).getAllByRole('cell');
    expect(phoneCells).to.have.length(3); // 1 icon + 2 text cells
    expect(phoneCells[1]).to.have.trimmed.text('phone');
    expect(phoneCells[2]).to.have.trimmed.text('5');

    const desktopCells = within(queries.getByRole('row', { name: /desktop/ })).getAllByRole('cell');
    expect(desktopCells).to.have.length(3);
    expect(desktopCells[1]).to.have.trimmed.text('desktop');
    expect(desktopCells[2]).to.have.trimmed.text('2');
  });

  it('should render no devices partial languageDictionary', () => {
    const queries = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      {},
      { someKey: 'someField' }
    );

    expect(queries.queryAllByRole('columnheader')).to.have.length(0);
    expect(queries.getByText('This user does not have any registered devices.')).to.exist;
  });

  it('should render real languageDictionary', () => {
    const queries = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      { phone: 5, desktop: 2 },
      {
        deviceNameColumnHeader: 'DeviceColumnHeader',
        deviceNumberTokensColumnHeader: 'DeviceNumberTokensColumnHeader',
        noDevicesMessage: 'Some No Device Message'
      }
    );

    /* Test the header */
    const columns = queries.getAllByRole('columnheader');
    expect(columns).to.have.length(3);
    expect(columns[0].children).to.have.length(0);
    expect(columns[1]).to.have.trimmed.text('DeviceColumnHeader');
    expect(columns[2]).to.have.trimmed.text('DeviceNumberTokensColumnHeader');
  });

  it('should render no devices real languageDictionary', () => {
    const queries = renderComponent(
      { username: 'bill', multifactor: ['guardian'] },
      {},
      {
        deviceNameColumnHeader: 'DeviceColumnHeader',
        deviceNumberTokensColumnHeader: 'DeviceNumberTokensColumnHeader',
        noDevicesMessage: 'Some No Device Message'
      }
    );

    expect(queries.queryAllByRole('columnheader')).to.have.length(0);
    expect(queries.getByText('Some No Device Message')).to.exist;
  });



});
