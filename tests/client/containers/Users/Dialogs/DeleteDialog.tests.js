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
        <DeleteDialog
          cancelDeleteUser={() => 'cancelDeleteUser'}
          deleteUser={() => 'deleteUser'}
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
  };

  it('should render', () => {
    const component = renderComponent('bill');

    checkText(component, 'Do you really want to delete ', 'bill', '? This will completely remove the user and cannot be undone.');
    checkConfirm(component, 'Delete User?');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent('bill', { someKey: 'someValue' });

    checkText(component, 'Do you really want to delete ', 'bill', '? This will completely remove the user and cannot be undone.');
    checkConfirm(component, 'Delete User?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      deleteDialogMessage: 'Some pre message {username} ignore second {username}',
      deleteDialogTitle: 'Delete User Title'
    };
    const component = renderComponent('bob', languageDictionary);

    checkText(component, 'Some pre message ', 'bob', ' ignore second {username}');
    checkConfirm(component, 'Delete User Title');
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
