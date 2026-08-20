import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import FieldsChangeDialog from '../../../../../client/containers/Users/Dialogs/FieldsChangeDialog';

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
    return render(
      <Provider store={fakeStore(initialState)}>
        <FieldsChangeDialog
          cancelChangeFields={() => null}
          changeFields={() => null}
        />
      </Provider>
    );
  };

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const checkTitle = (title) => {
    const modalHeader = document.querySelector('.modal-title');
    expect(modalHeader.textContent).to.equal(title);
  };

  it('should render', () => {
    renderComponent();

    checkTitle('Change Profile');
  });

  it('should render using language dictionary', () => {
    const languageDictionary = {
      changeProfileDialogTitle: 'Change Profile Title'
    };
    renderComponent(languageDictionary);

    checkTitle('Change Profile Title');
  });
});
