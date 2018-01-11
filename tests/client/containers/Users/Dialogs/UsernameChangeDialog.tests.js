import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import { Confirm } from 'auth0-extension-ui';

import fakeStore from '../../../../utils/fakeStore';

import UsernameChangeDialog from '../../../../../client/containers/Users/Dialogs/UsernameChangeDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args));

describe('#Client-Containers-Users-Dialogs-UsernameChangeDialog', () => {

  const renderComponent = (options, languageDictionary) => {
    options = options || {};
    const initialState = {
      usernameChange: fromJS({
        userName: options.username,
        error: null,
        requesting: true,
        loading: false
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS(options.settings || {})
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <UsernameChangeDialog
          cancelUsernameChange={() => null}
          usernameChange={() => null}
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

  const checkConnectionLabel = (component, connectionLabel) => {
    if (connectionLabel) {
      expect(document.querySelector('#username-change-connection-label')
        .textContent).to.equal(connectionLabel);
    } else {
      expect(document.querySelector('#username-change-connection-label')).to.be.null;
    }
  };

  const checkUsernameLabel = (component, usernameLabel) => {
    expect(document.querySelector('#username-change-username-label')
      .textContent).to.equal(usernameLabel);
  };

  const checkConfirm = (component, title, languageDictionary) => {
    const confirm = component.find(Confirm);
    expect(confirm.length).to.equal(1);
    expect(confirm.prop('languageDictionary')).to.deep.equal(languageDictionary);
    expect(confirm.prop('title')).to.deep.equal(title);
  }

  it('should render', () => {
    const component = renderComponent({username:'bill'});

    checkText(component, 'Do you really want to change the username for ', 'bill', '?');
    checkConnectionLabel(component, 'Connection');
    checkUsernameLabel(component, 'Username');
    checkConfirm(component, 'Change Username?', {});
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({username:'bill'}, { someKey: 'someValue' });

    checkText(component, 'Do you really want to change the username for ', 'bill', '?');
    checkConnectionLabel(component, 'Connection');
    checkUsernameLabel(component, 'Username');
    checkConfirm(component, 'Change Username?', { someKey: 'someValue' });
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent({username:'bill'}, { someKey: 'someValue' });

    checkText(component, 'Do you really want to change the username for ', 'bill', '?');
    checkConnectionLabel(component, 'Connection');
    checkUsernameLabel(component, 'Username');
    checkConfirm(component, 'Change Username?', { someKey: 'someValue' });
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      changeUsernameMessage: 'Some pre message {username} ignore second {username}',
      changeUsernameTitle: 'Change Username Title'
    };
    const component = renderComponent({username:'bob'}, languageDictionary);

    checkText(component, 'Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      changeUsernameMessage: 'Some other message {   username    }something else'
    };
    const component = renderComponent({username:'sally'}, languageDictionary);

    checkText(component, 'Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      changeUsernameMessage: 'no username included: '
    };
    const component = renderComponent({username:'john'}, languageDictionary);

    checkText(component, 'no username included: ', 'john', '');
  });

  it('should use userFields for whether connection appears', () => {
    const settings = {
      record: {
        settings: {
          userFields: [
            {
              property: 'username',
              label: 'UsernameLabel',
              edit: {}
            },
            {
              property: 'connection',
              label: 'ConnectionLabel',
              edit: false
            }
          ]
        }
      }
    };
    const component = renderComponent({username:'john', settings});
    checkConnectionLabel(component);

  });

  it('should use userFields for label names', () => {
    const settings = {
      record: {
        settings: {
          userFields: [
            {
              property: 'username',
              label: 'UsernameLabel',
              edit: {}
            },
            {
              property: 'connection',
              label: 'ConnectionLabel',
              edit: {}
            }
          ]
        }
      }
    };
    const component = renderComponent({username:'john', settings});
    checkConnectionLabel(component, 'ConnectionLabel');

  });

  it('should handle null label name in user fields', () => {
    const settings = {
      record: {
        settings: {
          userFields: [
            {
              property: 'username',
              label: 'UsernameLabel',
              edit: {}
            },
            {
              property: 'connection',
              edit: {}
            }
          ]
        }
      }
    };
    const component = renderComponent({username:'john', settings});
    checkConnectionLabel(component, 'Connection');

  });
});
