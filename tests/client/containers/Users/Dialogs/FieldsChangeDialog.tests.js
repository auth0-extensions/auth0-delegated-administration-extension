import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import FieldsChangeDialog from '../../../../../client/containers/Users/Dialogs/FieldsChangeDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args))

describe('#Client-Containers-Users-Dialogs-FieldsChangeDialog', () => {

  const renderComponent = (languageDictionary) => {
    const initialState = {
      fieldsChange: fromJS({
        userId: 1,
        record: {},
        error: null,
        requesting: true,
        loading: false
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      })
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <FieldsChangeDialog
          cancelChangeFields={() => null}
          changeFields={() => null}
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
    const modalHeader = document.querySelector('.modal-title');
    expect(modalHeader.textContent).to.equal(title);
  };

  it('should render', () => {
    const component = renderComponent();

    checkTitle(component, 'Change Profile');
  });

  it('should render using language dictionary', () => {
    const languageDictionary = {
      changeProfileDialogTitle: 'Change Profile Title'
    };
    const component = renderComponent(languageDictionary);

    checkTitle(component, 'Change Profile Title', languageDictionary);
  });
});
