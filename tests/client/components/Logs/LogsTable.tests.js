import React from 'react';
import moment from 'moment';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import LogsTable from '../../../../client/components/Logs/LogsTable';

describe('#Client-Components-Logs-LogsTable', () => {
  const aDayAgo = moment().add(-1, 'days');

  const success = {
    event: 'sapi',
    icon: { name: 'success', color: 'green' }
  };

  const fail = {
    event: 'fapi',
    description: 'some description',
    icon: { name: 'failure', color: 'red' }
  };

  const dummyLogs = [
    { type: success, shortType: 'sapi', user_name: 'bill', date: aDayAgo, connection: 'connA', client_name: 'client' },
    { type: fail, shortType: 'fapi', description: 'some description', date: aDayAgo }
  ];

  const renderComponent = (logs, languageDictionary, suppressRawData, isUserLogs) => {
    return render(
      <LogsTable
        loading={false}
        error={null}
        onOpen={() => 'onOpen'}
        logs={fromJS(logs)}
        settings={{ suppressRawData }}
        isUserLogs={isUserLogs}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const checkRow = (queries, index, target) => {
    const rows = queries.getAllByRole('row');
    expect(rows.length).to.be.greaterThan(index + 1);
    const cells = within(rows[index + 1]).getAllByRole('cell');
    expect(cells).to.have.length(6); // 1 icon + 5 text cells

    const icon = cells[0].querySelector('i');
    expect(icon).to.have.class(`icon-budicon-${target.icon.name}`);
    expect(icon.style.color).to.equal(target.icon.color);

    expect(cells[1]).to.have.trimmed.text(target.text[0]);
    expect(cells[2]).to.have.trimmed.text(target.text[1]);
    expect(cells[3]).to.have.trimmed.text(target.text[2]);
    expect(cells[4]).to.have.trimmed.text(target.text[3]);
    expect(cells[5]).to.have.trimmed.text(target.text[4]);
  };

  const checkDefault = (languageDictionary, suppressRawData, isUserLogs) => {
    const queries = renderComponent(dummyLogs, languageDictionary, suppressRawData, isUserLogs);

    const headerCells = queries.getAllByRole('columnheader');
    expect(headerCells).to.have.length(6);
    expect(headerCells[0].children).to.have.length(0);
    expect(headerCells[1]).to.have.trimmed.text('Event');
    expect(headerCells[2]).to.have.trimmed.text('Description');
    expect(headerCells[3]).to.have.trimmed.text('Date');
    expect(headerCells[4]).to.have.trimmed.text('Connection');
    expect(headerCells[5]).to.have.trimmed.text('Application');

    /* Test the rows */
    checkRow(queries, 0, {
      icon: { color: 'green', name: 'success' },
      text: ['sapi', 'bill', 'a day ago', 'connA', 'client'],
      control: (suppressRawData) ? 'null' : 'function'
    });
    checkRow(queries, 1, {
      icon: { color: 'red', name: 'failure' },
      text: ['fapi', 'some description', 'a day ago', 'N/A', 'N/A'],
      control: (suppressRawData) ? 'null' : 'function'
    });
  };

  it('should render', () => {
    checkDefault();
  });

  it('should render with suppressed raw data', () => {
    checkDefault({}, true);
  });


  it('should render language dictionary', () => {
    const languageDictionary = {
      logTypes: {
        fapi: {
          event: 'Fapi Event',
          description: 'Fapi Description'
        },
        sapi: {
          event: 'Sapi Event',
          description: 'Sapi Description'
        }
      }
    };

    const queries = renderComponent(dummyLogs, languageDictionary, false, true);

    const headerCells = queries.getAllByRole('columnheader');
    expect(headerCells).to.have.length(6);
    expect(headerCells[0].children).to.have.length(0);
    expect(headerCells[1]).to.have.trimmed.text('Event');
    expect(headerCells[2]).to.have.trimmed.text('Description');
    expect(headerCells[3]).to.have.trimmed.text('Date');
    expect(headerCells[4]).to.have.trimmed.text('Connection');
    expect(headerCells[5]).to.have.trimmed.text('Application');

    /* Test the rows */
    checkRow(queries, 0, {
      icon: { color: 'green', name: 'success' },
      text: ['Sapi Event', 'Sapi Description', 'a day ago', 'connA', 'client'],
      control: 'function'
    });
    checkRow(queries, 1, {
      icon: { color: 'red', name: 'failure' },
      text: ['Fapi Event', 'Fapi Description', 'a day ago', 'N/A', 'N/A'],
      control: 'function'
    });
  });

  it('should render not applicable language dictionary', () => {
    checkDefault({ 'field': 'value' });
  });

  it('should render language dictionary', () => {
    const languageDictionary = {
      logEventColumnHeader: 'EventHeader',
      logDescriptionColumnHeader: 'DescriptionHeader',
      logDateColumnHeader: 'DateHeader',
      logConnectionColumnHeader: 'ConnectionHeader',
      logApplicationColumnHeader: 'ApplicationHeader',
      momentLocale: 'fr',
      notApplicableLabel: 'Not Applicable',
      logTypes: {
        fapi: {
          event: 'Fapi Event',
          description: 'Fapi Description'
        },
        sapi: {
          event: 'Sapi Event',
          description: 'Sapi Description'
        }
      }
    };

    const queries = renderComponent(dummyLogs, languageDictionary);

    const headerCells = queries.getAllByRole('columnheader');
    expect(headerCells).to.have.length(6);
    expect(headerCells[0].children).to.have.length(0);
    expect(headerCells[1]).to.have.trimmed.text('EventHeader');
    expect(headerCells[2]).to.have.trimmed.text('DescriptionHeader');
    expect(headerCells[3]).to.have.trimmed.text('DateHeader');
    expect(headerCells[4]).to.have.trimmed.text('ConnectionHeader');
    expect(headerCells[5]).to.have.trimmed.text('ApplicationHeader');

    /* Test the rows */
    checkRow(queries, 0, {
      icon: { color: 'green', name: 'success' },
      text: ['Sapi Event', 'bill', 'il y a un jour', 'connA', 'client'],
      control: 'function'
    });
    checkRow(queries, 1, {
      icon: { color: 'red', name: 'failure' },
      text: ['Fapi Event', 'Fapi Description', 'il y a un jour', 'Not Applicable', 'Not Applicable'],
      control: 'function'
    });
  });

  it('should render with no logs', () => {
    const { getByText } = renderComponent([]);

    expect(getByText(/No logs found/)).to.exist;
  });

  it('should render with no logs languageDictionary', () => {
    const { getByText } = renderComponent([], { noLogsMessage: 'some no logs message' });

    expect(getByText('some no logs message')).to.exist;
  });

});
