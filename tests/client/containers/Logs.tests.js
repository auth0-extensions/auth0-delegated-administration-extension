import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { fromJS } from 'immutable';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import moment from 'moment';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'
import proxyquire from 'proxyquire';

import fakeStore from '../../utils/fakeStore';

/* Record the props each child component receives so we can assert what Logs passes down. */
let captured = {};
const StubChild = (name) => (props) => {
  captured[name] = (captured[name] || []).concat(props);
  return null;
};

const Logs = proxyquire('../../../client/containers/Logs', {
  '../components/Logs/LogDialog': { '__esModule': true, default: StubChild('LogDialog') },
  '../components/Logs/LogsTable': { '__esModule': true, default: StubChild('LogsTable') },
  '../components/TabsHeader': { '__esModule': true, default: StubChild('TabsHeader') }
}).default;

class LogsWrapper extends Component {
  render() {
    return <Logs accessLevel={{ role: 1 }}/>;
  }
}

describe('#Client-Containers-Logs', () => {
  let stub;

  before(() => {
    // mock api calls
    stub = new MockAdapter(axios);
    stub.onGet('/api/logs').reply(200, {});
  });

  after(() => {
      stub.restore();
  });

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

  const renderComponent = (languageDictionary) => {
    const initialState = {
      logs: fromJS({
        error: null,
        loading: false,
        records: dummyLogs,
        total: 2
      }),
      log: fromJS({
        error: null,
        loading: false,
        id: 1,
        record: {}
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS({ loading: false, record: { settings: {} } })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<LogsWrapper/>}/>
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
    checkForLanguageDictionary('LogDialog', languageDictionary);
    checkForLanguageDictionary('LogsTable', languageDictionary);
    checkForLanguageDictionary('TabsHeader', languageDictionary);
  };

  const checkButtons = (container, refreshText, loadMoreText) => {
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).to.equal(2);
    expect(buttons[0]).to.have.trimmed.text(refreshText);
    expect(buttons[1]).to.have.trimmed.text(loadMoreText);
  };

  it('should render', () => {
    const component = renderComponent();

    checkAllComponentsForLanguageDictionary({});
    checkButtons(component.container, 'Refresh', 'Load More');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary({ someKey: 'someValue' });
    checkButtons(component.container, 'Refresh', 'Load More');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      logsRefreshButtonText: 'Refresh Text',
      logsLoadMoreButtonText: 'Load More Text'
    };

    const component = renderComponent(languageDictionary);

    checkAllComponentsForLanguageDictionary(languageDictionary);
    checkButtons(component.container, 'Refresh Text', 'Load More Text');
  });
});
