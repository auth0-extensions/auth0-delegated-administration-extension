import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Modal } from 'react-bootstrap';

import { Confirm } from 'auth0-extension-ui';

import fakeStore from '../../../../utils/fakeStore';

import CreateDialog from '../../../../../client/containers/Users/Dialogs/CreateDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args))

describe('#Client-Containers-Users-Dialogs-CreateDialog', () => {

  const renderComponent = (languageDictionary) => {
    const initialState = {
      userCreate: fromJS({
        error: null,
        record: { name: 'bill' },
        loading: false
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      accessLevel: fromJS({
        record: {}
      }),
      connections: fromJS({ records: [{ name: 'connA' }] })
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <CreateDialog
          createUser={() => null}
          getDictValue={() => null}
          cancelCreateUser={() => null}
          userFields={[]}
        />
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

  const checkTitle = (component, title) => {
    const modalHeader = document.querySelector('.has-border');
    expect(modalHeader.textContent).to.equal(title);
  };

  it('should render', () => {
    const component = renderComponent();

    checkTitle(component, 'Create User')
  });

  it('should render using language dictionary', () => {
    const languageDictionary = {
      createDialogTitle: 'Create Dialog Title'
    };
    const component = renderComponent(languageDictionary);

    checkTitle(component, 'Create Dialog Title', languageDictionary)
  });
});
