import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import DeleteDialog from '../../../../../client/containers/Users/Dialogs/DeleteDialog';

describe('#Client-Containers-Users-Dialogs-DeleteDialog', () => {

  const renderComponent = (username, languageDictionary) => {
    const initialState = {
      userDelete: fromJS({
        user: { name: username },
        error: null,
        requesting: true,
        loading: false
      }),
      settings: fromJS({}),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <DeleteDialog
          cancelDeleteUser={() => 'cancelDeleteUser'}
          deleteUser={() => 'deleteUser'}
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

  const checkText = (preText, username, postText) => {
    const pElement = document.querySelector('p');
    expect(pElement.textContent).to.equal(`${preText}${username}${postText}`);
  };

  const checkConfirm = (title) => {
    const modalTitle = document.querySelector('.modal-title');
    expect(modalTitle).to.exist;
    expect(modalTitle.textContent).to.equal(title);
  };

  it('should render', () => {
    renderComponent('bill');

    checkText('Do you really want to delete ', 'bill', '? This will completely remove the user and cannot be undone.');
    checkConfirm('Delete User?');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent('bill', { someKey: 'someValue' });

    checkText('Do you really want to delete ', 'bill', '? This will completely remove the user and cannot be undone.');
    checkConfirm('Delete User?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      deleteDialogMessage: 'Some pre message {username} ignore second {username}',
      deleteDialogTitle: 'Delete User Title'
    };
    renderComponent('bob', languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
    checkConfirm('Delete User Title');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      deleteDialogMessage: 'Some other message {   username    }something else'
    };
    renderComponent('sally', languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      deleteDialogMessage: 'no username included: '
    };
    renderComponent('john', languageDictionary);

    checkText('no username included: ', 'john', '');
  });
});
