import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import UnblockDialog from '../../../../../client/containers/Users/Dialogs/UnblockDialog';

describe('#Client-Containers-Users-Dialogs-UnblockDialog', () => {

  const renderComponent = (username, languageDictionary) => {
    const initialState = {
      unblock: fromJS({
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
        <UnblockDialog
          cancelUnblockUser={() => 'cancelUnblockUser'}
          unblockUser={() => 'unblockUser'}
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
  }

  it('should render', () => {
    renderComponent('bill');

    checkText('Do you really want to unblock ', 'bill', '? After doing so the user will be able to sign in again.');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent('bill', { someKey: 'someValue' });

    checkText('Do you really want to unblock ', 'bill', '? After doing so the user will be able to sign in again.');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      unblockDialogMessage: 'Some pre message {username} ignore second {username}'
    };
    renderComponent('bob', languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      unblockDialogMessage: 'Some other message {   username    }something else'
    };
    renderComponent('sally', languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      unblockDialogMessage: 'no username included: '
    };
    renderComponent('john', languageDictionary);

    checkText('no username included: ', 'john', '');
  });

  it('should render confirm gets languageDictionary', () => {
    const languageDictionary = { someKey: 'someValue', unblockDialogTitle: 'Unblock User Alternate Title' };
    renderComponent('june', languageDictionary);
    checkConfirm('Unblock User Alternate Title');
  });

  it('should render confirm gets null languageDictionary', () => {
    renderComponent('jackie');
    checkConfirm('Unblock User?');
  });
});
