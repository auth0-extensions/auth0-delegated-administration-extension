import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import CreateDialog from '../../../../../client/containers/Users/Dialogs/CreateDialog';

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
    return render(
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

    checkTitle('Create User');
  });

  it('should render using language dictionary', () => {
    const languageDictionary = {
      createDialogTitle: 'Create Dialog Title'
    };
    renderComponent(languageDictionary);

    checkTitle('Create Dialog Title');
  });
});
