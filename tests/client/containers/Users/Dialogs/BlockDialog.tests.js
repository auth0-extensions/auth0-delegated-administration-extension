import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import BlockDialog from '../../../../../client/containers/Users/Dialogs/BlockDialog';

describe('#Client-Containers-Users-Dialogs-BlockDialog', () => {

  const renderComponent = (username, languageDictionary) => {
    const initialState = {
      block: fromJS({
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
        <BlockDialog
          cancelBlockUser={() => 'cancelBlockUser'}
          blockUser={() => 'blockUser'}
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
    checkText('Do you really want to block ', 'bill', '? After doing so the user will not be able to sign in anymore.');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent('bill', { someKey: 'someValue' });
    checkText('Do you really want to block ', 'bill', '? After doing so the user will not be able to sign in anymore.');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      blockDialogMessage: 'Some pre message {username} ignore second {username}'
    };
    renderComponent('bob', languageDictionary);
    checkText('Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      blockDialogMessage: 'Some other message {   username    }something else'
    };
    renderComponent('sally', languageDictionary);
    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      blockDialogMessage: 'no username included: '
    };
    renderComponent('john', languageDictionary);
    checkText('no username included: ', 'john', '');
  });

  it('should render confirm gets languageDictionary', () => {
    const languageDictionary = { someKey: 'someValue', blockDialogTitle: 'Block User Alternate Title' };
    renderComponent('june', languageDictionary);
    checkConfirm('Block User Alternate Title');
  });

  it('should render confirm gets null languageDictionary', () => {
    renderComponent('jackie');
    checkConfirm('Block User?');
  });
});
