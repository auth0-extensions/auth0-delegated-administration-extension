import React  from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it} from 'mocha';
import { fromJS } from 'immutable';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios'

import fakeStore from '../../utils/fakeStore';

import App from '../../../client/containers/App';
import Header from '../../../client/components/Header';

let wrapper = undefined;
const wrapperMount = (...args) => (wrapper = mount(...args));

describe('#Client-Containers-App', () => {
  let stub;

  before(() => {
    // mock api calls from App > componentWillMount
    stub = new MockAdapter(axios);
    stub.onGet('/api/applications').reply(200, []);
    stub.onGet('/api/settings').reply(200, {});
    stub.onGet('/api/connections').reply(200, []);
    stub.onGet('/api/me').reply(200, {});
  });

  after(() => {
      stub.restore();
  });


  const renderComponent = (languageDictionary) => {
    const initialState = {
      accessLevel: fromJS({ record: { role: 1 } }),
      auth: fromJS({
        user: {},
        issuer: 'auth0'
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS({ loading: false, record: { settings: {} } })
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <App><p>Some Child</p></App>
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
    checkForLanguageDictionary(component, Header, languageDictionary);
  };

  it('should render', () => {
    const component = renderComponent();

    checkAllComponentsForLanguageDictionary(component, {});
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({ someKey: 'someValue' });

    checkAllComponentsForLanguageDictionary(component, { someKey: 'someValue' });
  });
});
