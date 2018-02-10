import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Modal } from 'react-bootstrap';

import { Confirm } from 'auth0-extension-ui';

import fakeStore from '../../../../utils/fakeStore';

import UnblockDialog from '../../../../../client/containers/Users/Dialogs/UnblockDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args))

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
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <UnblockDialog
          cancelUnblockUser={() => 'cancelUnblockUser'}
          unblockUser={() => 'unblockUser'}
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

  const checkText = (component, preText, username, postText) => {
    expect(document.querySelector('p')
      .textContent).to.equal(`${preText}${username}${postText}`);
  };

  const checkConfirm = (component, title, languageDictionary) => {
    const confirm = component.find(Confirm);
    expect(confirm.length).to.equal(1);
    expect(confirm.prop('languageDictionary')).to.deep.equal(languageDictionary);
    expect(confirm.prop('title')).to.deep.equal(title);
  }

  it('should render', () => {
    const component = renderComponent('bill');

    checkText(component, 'Do you really want to unblock ', 'bill', '? After doing so the user will be able to sign in again.');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent('bill', { someKey: 'someValue' });

    checkText(component, 'Do you really want to unblock ', 'bill', '? After doing so the user will be able to sign in again.');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      unblockDialogMessage: 'Some pre message {username} ignore second {username}'
    };
    const component = renderComponent('bob', languageDictionary);

    checkText(component, 'Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      unblockDialogMessage: 'Some other message {   username    }something else'
    };
    const component = renderComponent('sally', languageDictionary);

    checkText(component, 'Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      unblockDialogMessage: 'no username included: '
    };
    const component = renderComponent('john', languageDictionary);

    checkText(component, 'no username included: ', 'john', '');
  });

  it('should render confirm gets languageDictionary', () => {
    const languageDictionary = { someKey: 'someValue', unblockDialogTitle: 'Unblock User Alternate Title' };
    const component = renderComponent('june', languageDictionary);
    checkConfirm(component, 'Unblock User Alternate Title', languageDictionary);
  });

  it('should render confirm gets null languageDictionary', () => {
    const component = renderComponent('jackie');
    checkConfirm(component, 'Unblock User?', {});
  });
});
