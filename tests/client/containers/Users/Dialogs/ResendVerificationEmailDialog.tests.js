import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import ResendVerificationEmailDialog from '../../../../../client/containers/Users/Dialogs/ResendVerificationEmailDialog';

describe('#Client-Containers-Users-Dialogs-ResendVerificationEmailDialog', () => {

  const renderComponent = (username, languageDictionary) => {
    const initialState = {
      verificationEmail: fromJS({
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
        <ResendVerificationEmailDialog
          cancelResendVerificationEmail={() => null}
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

    checkText(
      'Do you really want to resend verification email to ',
      'bill',
      '?');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent('bill', { someKey: 'someValue' });

    checkText('Do you really want to resend verification email to ', 'bill', '?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      resendVerificationEmailMessage: 'Some pre message {username} ignore second {username}'
    };
    renderComponent('bob', languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      resendVerificationEmailMessage: 'Some other message {   username    }something else'
    };
    renderComponent('sally', languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      resendVerificationEmailMessage: 'no username included: '
    };
    renderComponent('john', languageDictionary);

    checkText('no username included: ', 'john', '');
  });

  it('should render confirm gets languageDictionary', () => {
    const languageDictionary = { someKey: 'someValue',
      resendVerificationEmailTitle: 'Resend Verification Email Alternate Title' };
    renderComponent('june', languageDictionary);
    checkConfirm('Resend Verification Email Alternate Title');
  });

  it('should render confirm gets null languageDictionary', () => {
    renderComponent('jackie');
    checkConfirm('Resend Verification Email?');
  });
});
