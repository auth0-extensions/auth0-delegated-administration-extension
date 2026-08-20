import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import RemoveMultiFactorDialog, { parseProviders } from '../../../../../client/containers/Users/Dialogs/RemoveMultiFactorDialog';

describe('#Client-Containers-Users-Dialogs-RemoveMultiFactorDialog', () => {

  const renderComponent = (username, languageDictionary) => {
    const initialState = {
      mfa: fromJS({
        user: { name: username },
        error: null,
        requesting: true,
        loading: false,
        connection: 'connA'
      }),
      settings: fromJS({}),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <RemoveMultiFactorDialog
          cancelRemoveMultiFactor={() => null}
        />
      </Provider>
    );
  };

  const renderComponentWithMfa = (username, multifactor, userFields) => {
    const initialState = {
      mfa: fromJS({
        user: { name: username, multifactor },
        error: null,
        requesting: true,
        loading: false,
        connection: 'connA'
      }),
      settings: userFields
        ? fromJS({ record: { settings: { userFields } } })
        : fromJS({}),
      languageDictionary: fromJS({ record: {} })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <RemoveMultiFactorDialog cancelRemoveMultiFactor={() => null} />
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
      'Do you really want to remove the multi factor authentication settings for ',
      'bill',
      '? This will allow the user to authenticate and reconfigure a new device.');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent('bill', { someKey: 'someValue' });

    checkText('Do you really want to remove the multi factor authentication settings for ', 'bill', '? This will allow the user to authenticate and reconfigure a new device.');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      removeMultiFactorMessage: 'Some pre message {username} ignore second {username}'
    };
    renderComponent('bob', languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      removeMultiFactorMessage: 'Some other message {   username    }something else'
    };
    renderComponent('sally', languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      removeMultiFactorMessage: 'no username included: '
    };
    renderComponent('john', languageDictionary);

    checkText('no username included: ', 'john', '');
  });

  it('should render confirm gets languageDictionary', () => {
    const languageDictionary = { someKey: 'someValue',
      removeMultiFactorTitle: 'Remove Multifactor Alternate Title' };
    renderComponent('june', languageDictionary);
    checkConfirm('Remove Multifactor Alternate Title');
  });

  it('should render confirm gets null languageDictionary', () => {
    renderComponent('jackie');
    checkConfirm('Remove Multi Factor Authentication?');
  });

  it('should render when user has a single MFA provider', () => {
    renderComponentWithMfa('bill', ['totp']);
    checkConfirm('Remove Multi Factor Authentication?');
  });

  it('should render when user has multiple MFA providers', () => {
    renderComponentWithMfa('bill', ['totp', 'recovery-code']);
    checkConfirm('Remove Multi Factor Authentication?');
  });

  it('should render without crashing when multifactor is a raw array due to edit:false in userFields', () => {
    const userFields = [{ property: 'multifactor', edit: false }];
    renderComponentWithMfa('bill', ['totp', 'recovery-code'], userFields);
    checkConfirm('Remove Multi Factor Authentication?');
  });

  it('should render without crashing when user has passkey and non-passkey providers with edit:false in userFields', () => {
    const userFields = [{ property: 'multifactor', edit: false }];
    renderComponentWithMfa('bill', ['passkey', 'totp'], userFields);
    checkConfirm('Remove Multi Factor Authentication?');
  });
});

describe('#parseProviders', () => {
  it('returns an array unchanged', () => {
    expect(parseProviders(['totp', 'recovery-code'])).to.deep.equal(['totp', 'recovery-code']);
  });

  it('parses a JSON array string', () => {
    expect(parseProviders('["totp","recovery-code"]')).to.deep.equal(['totp', 'recovery-code']);
  });

  it('wraps a plain string provider in an array', () => {
    expect(parseProviders('totp')).to.deep.equal(['totp']);
  });

  it('wraps a malformed JSON string in an array rather than throwing', () => {
    expect(parseProviders('[totp,recovery-code]')).to.deep.equal(['[totp,recovery-code]']);
  });
});
