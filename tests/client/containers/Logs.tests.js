import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Router, Route, createMemoryHistory } from 'react-router';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

import fakeStore from '../../utils/fakeStore';

import Logs from '../../../client/containers/Logs';
import TabsHeader from '../../../client/components/TabsHeader';
import LogsTable from '../../../client/components/Logs/LogsTable';
import LogDialog from '../../../client/components/Logs/LogDialog';

let wrapper = undefined;
const wrapperMount = (...args) => (wrapper = mount(...args));
const memoryHistory = createMemoryHistory({});

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
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <Router history={memoryHistory}>
          <Route path="/" component={LogsWrapper}/>
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
    checkForLanguageDictionary(component, LogDialog, languageDictionary);
    checkForLanguageDictionary(component, LogsTable, languageDictionary);
    checkForLanguageDictionary(component, TabsHeader, languageDictionary);
  };

  const checkButtons = (component, refreshText, loadMoreText) => {
    const buttons = component.find(Button);
    expect(buttons.length).to.equal(2);
    expect(buttons.at(0).text()).to.equal(' '+refreshText);
    expect(buttons.at(1).text()).to.equal(' '+loadMoreText);
  };

  it('should render', () => {
    const component = renderComponent();

    checkAllComponentsForLanguageDictionary(component, {});
    checkButtons(component, 'Refresh', 'Load More');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary(component, { someKey: 'someValue' });
    checkButtons(component, 'Refresh', 'Load More');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      logsRefreshButtonText: 'Refresh Text',
      logsLoadMoreButtonText: 'Load More Text'
    };

    const component = renderComponent(languageDictionary);

    checkAllComponentsForLanguageDictionary(component, languageDictionary);
    checkButtons(component, 'Refresh Text', 'Load More Text');
  });
});
