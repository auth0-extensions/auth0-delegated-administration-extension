import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Modal } from 'react-bootstrap';

import { Confirm } from 'auth0-extension-ui';

import fakeStore from '../../../../utils/fakeStore';

import RemoveMultiFactorDialog from '../../../../../client/containers/Users/Dialogs/RemoveMultiFactorDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args))

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
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <RemoveMultiFactorDialog
          cancelRemoveMultiFactor={() => null}
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

  const checkConfirm = (component, title) => {
    const confirm = component.find(Confirm);
    expect(confirm.length).to.equal(1);
    expect(confirm.prop('title')).to.deep.equal(title);
  }

  it('should render', () => {
    const component = renderComponent('bill');

    checkText(component, 
      'Do you really want to remove the multi factor authentication settings for ', 
      'bill', 
      '? This will allow the user to authenticate and reconfigure a new device.');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent('bill', { someKey: 'someValue' });

    checkText(component, 'Do you really want to remove the multi factor authentication settings for ', 'bill', '? This will allow the user to authenticate and reconfigure a new device.');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      removeMultiFactorMessage: 'Some pre message {username} ignore second {username}'
    };
    const component = renderComponent('bob', languageDictionary);

    checkText(component, 'Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      removeMultiFactorMessage: 'Some other message {   username    }something else'
    };
    const component = renderComponent('sally', languageDictionary);

    checkText(component, 'Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      removeMultiFactorMessage: 'no username included: '
    };
    const component = renderComponent('john', languageDictionary);

    checkText(component, 'no username included: ', 'john', '');
  });

  it('should render confirm gets languageDictionary', () => {
    const languageDictionary = { someKey: 'someValue',
      removeMultiFactorTitle: 'Remove Multifactor Alternate Title' };
    const component = renderComponent('june', languageDictionary);
    checkConfirm(component, 'Remove Multifactor Alternate Title');
  });

  it('should render confirm gets null languageDictionary', () => {
    const component = renderComponent('jackie');
    checkConfirm(component, 'Remove Multi Factor Authentication?');
  });
});
