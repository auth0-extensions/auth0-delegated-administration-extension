import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import LogsTable from '../../../../client/components/Logs/LogsTable';
import { TableRow, TableIconCell, TableTextCell, TableHeader, TableColumn } from 'auth0-extension-ui';

describe('#Client-Components-Logs-LogsTable', () => {
  const aDayAgo = moment().add(-1, 'days');

  const success = {
    event: 'sapi',
    icon: { name: 'success', color: 'green' }
  };

  const fail = {
    event: 'fapi',
    icon: { name: 'failure', color: 'red' }
  };

  const dummyLogs = [
    { type: success, user_name: 'bill', date: aDayAgo, connection: 'connA', client_name: 'client' },
    { type: fail, description: 'some description', date: aDayAgo }
  ];

  const renderComponent = (logs, languageDictionary) => {
    return shallow(
      <LogsTable
        loading={false}
        error={null}
        onOpen={() => 'onOpen'}
        logs={fromJS(logs)}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const checkRow = (component, index, target) => {
    const row = component.find(TableRow).filterWhere(element => element.key() === index.toString());
    expect(row.length).to.equal(1);

    const iconColumn = row.find(TableIconCell);
    expect(iconColumn.length).to.equal(1);
    expect(iconColumn.prop('color')).to.equal(target.icon.color);
    expect(iconColumn.prop('icon')).to.equal(target.icon.name);

    const textColumns = row.find(TableTextCell);
    expect(textColumns.length).to.equal(5);
    // could use map here, but easier to debug if issue with them separated
    expect(textColumns.at(0).childAt(0).text()).to.equal(target.text[0]);
    expect(textColumns.at(1).childAt(0).text()).to.equal(target.text[1]);
    expect(textColumns.at(2).childAt(0).text()).to.equal(target.text[2]);
    expect(textColumns.at(3).childAt(0).text()).to.equal(target.text[3]);
    expect(textColumns.at(4).childAt(0).text()).to.equal(target.text[4]);
  };

  const checkDefault = (languageDictionary) => {
    const component = renderComponent(dummyLogs, languageDictionary);

    expect(component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = component.find(TableHeader);
    expect(header.length).to.equal(1);
    const columns = header.find(TableColumn);
    expect(columns.length).to.equal(6);
    expect(columns.at(0).childAt(0).text()).to.equal('');
    expect(columns.at(1).childAt(0).text()).to.equal('Event');
    expect(columns.at(2).childAt(0).text()).to.equal('Description');
    expect(columns.at(3).childAt(0).text()).to.equal('Date');
    expect(columns.at(4).childAt(0).text()).to.equal('Connection');
    expect(columns.at(5).childAt(0).text()).to.equal('Application');

    /* Test the rows */
    checkRow(component, 0, {
      icon: { color: 'green', name: 'success' },
      text: ['sapi', 'bill', 'a day ago', 'connA', 'client']
    });
    checkRow(component, 1, {
      icon: { color: 'red', name: 'failure' },
      text: ['fapi', 'some description', 'a day ago', 'N/A', 'N/A']
    });
  }

  it('should render', () => {
    checkDefault();
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
      notApplicableLabel: 'Not Applicable'
    };

    const component = renderComponent(dummyLogs, languageDictionary);

    expect(component.length).to.be.greaterThan(0);

    /* Test the header */
    const header = component.find(TableHeader);
    expect(header.length).to.equal(1);
    const columns = header.find(TableColumn);
    expect(columns.length).to.equal(6);
    expect(columns.at(0).childAt(0).text()).to.equal('');
    expect(columns.at(1).childAt(0).text()).to.equal('EventHeader');
    expect(columns.at(2).childAt(0).text()).to.equal('DescriptionHeader');
    expect(columns.at(3).childAt(0).text()).to.equal('DateHeader');
    expect(columns.at(4).childAt(0).text()).to.equal('ConnectionHeader');
    expect(columns.at(5).childAt(0).text()).to.equal('ApplicationHeader');

    /* Test the rows */
    checkRow(component, 0, {
      icon: { color: 'green', name: 'success' },
      text: ['sapi', 'bill', 'il y a un jour', 'connA', 'client']
    });
    checkRow(component, 1, {
      icon: { color: 'red', name: 'failure' },
      text: ['fapi', 'some description', 'il y a un jour', 'Not Applicable', 'Not Applicable']
    });
  });

  it('should render with no logs', () => {
    const component = renderComponent([]);

    expect(component.length).to.be.greaterThan(0);
    expect(component.childAt(0).text()).to.equal('No logs found');
  });

  it('should render with no logs languageDictionary', () => {
    const component = renderComponent([], { noLogsMessage: 'some no logs message' });

    expect(component.length).to.be.greaterThan(0);
    expect(component.childAt(0).text()).to.equal('some no logs message');
  });

});
