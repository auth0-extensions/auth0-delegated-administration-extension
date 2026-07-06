import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { fromJS } from 'immutable';

import RequireAuthentication from '../../../client/containers/RequireAuthentication';
import fakeStore from '../../utils/fakeStore';

const Dummy = () => <div>protected</div>;
const Protected = RequireAuthentication(Dummy);

let wrapper;

describe('#Client-Containers-RequireAuthentication', () => {
  beforeEach(() => {
    wrapper = undefined;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) wrapper.unmount();
  });

  it('should encode all query params in the login returnUrl', () => {
    const pushCalls = [];
    const store = {
      ...fakeStore(),
      getState: () => ({
        auth: fromJS({
          isAuthenticated: false,
          isAuthenticating: false
        })
      }),
      dispatch: (action) => {
        if (action.type === '@@router/CALL_HISTORY_METHOD' && action.payload.method === 'push') {
          pushCalls.push(action.payload.args[0]);
        }
      }
    };

    wrapper = mount(
      <Provider store={store}>
        <Protected
          location={{
            pathname: '/users',
            search: '?search=134&filterBy=app_metadata.external_id'
          }}
        />
      </Provider>
    );

    expect(pushCalls.length).to.equal(1);
    const parsed = new URL(pushCalls[0], 'http://localhost');
    expect(parsed.href).to.equal(
      'http://localhost/login?returnUrl=%2Fusers%3Fsearch%3D134%26filterBy%3Dapp_metadata.external_id'
    );
  });
});
