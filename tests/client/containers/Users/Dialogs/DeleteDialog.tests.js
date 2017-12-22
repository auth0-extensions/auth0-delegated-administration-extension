import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';
import { Modal } from 'react-bootstrap';

import { Confirm } from 'auth0-extension-ui';

import fakeStore from '../../../../utils/fakeStore';

import DeleteDialog from '../../../../../client/containers/Users/Dialogs/DeleteDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args));

describe('#Client-Containers-Users-Dialogs-DeleteDialog', () => {

  const renderComponent = (username, languageDictionary) => {
    const initialState = {
      userDelete: fromJS({
        userName: username,
        error: null,
        requesting: true,
        loading: false
      })
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <DeleteDialog
          cancelDeleteUser={() => 'cancelDeleteUser'}
          deleteUser={() => 'deleteUser'}
          languageDictionary={languageDictionary}
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

    checkText(component, 'Do you really want to delete ', 'bill', '? This will completely remove the user and cannot be undone.');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent('bill', { someKey: 'someValue' });

    checkText(component, 'Do you really want to delete ', 'bill', '? This will completely remove the user and cannot be undone.');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      deleteDialogMessage: 'Some pre message {username} ignore second {username}'
    };
    const component = renderComponent('bob', languageDictionary);

    checkText(component, 'Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      deleteDialogMessage: 'Some other message {   username    }something else'
    };
    const component = renderComponent('sally', languageDictionary);

    checkText(component, 'Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      deleteDialogMessage: 'no username included: '
    };
    const component = renderComponent('john', languageDictionary);

    checkText(component, 'no username included: ', 'john', '');
  });
});
