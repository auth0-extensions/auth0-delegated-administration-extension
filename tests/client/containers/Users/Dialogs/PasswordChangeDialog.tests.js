import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import { Confirm } from 'auth0-extension-ui';

import fakeStore from '../../../../utils/fakeStore';

import PasswordChangeDialog from '../../../../../client/containers/Users/Dialogs/PasswordChangeDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args));

describe('#Client-Containers-Users-Dialogs-PasswordChangeDialog', () => {

  const renderComponent = (options, languageDictionary) => {
    options = options || {};
    const initialState = {
      passwordChange: fromJS({
        user: { name: options.username, email: 'four@horseman.com' },
        connection: 'connA',
        error: null,
        requesting: true,
        loading: false
      }),
      connections: fromJS({
        records: options.connections || [ { name: 'connA' }, { name: 'connB' } ]
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS(options.settings || {})
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <PasswordChangeDialog
          cancelPasswordChange={() => null}
          changePassword={() => null}
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
      const label = document.querySelector('label[for=connection]');
      expect(label).to.not.be.null;
      expect(label.textContent).to.equal(connectionLabel);
    } else {
      expect(document.querySelector('label[for=connection]')).to.be.null;
    }
  };

  const checkEmailLabel = (component, emailLabel) => {
    expect(document.querySelector('label[for=email]')
      .textContent).to.equal(emailLabel);
  };

  const checkPasswordLabel = (component, passwordLabel) => {
    expect(document.querySelector('label[for=password]')
      .textContent).to.equal(passwordLabel);
  };

  const checkRepeatPasswordLabel = (component, passwordLabel) => {
    expect(document.querySelector('label[for=repeatPassword]')
      .textContent).to.equal(passwordLabel);
  };

  const checkConfirm = (component, title) => {
    const confirm = component.find(Confirm);
    expect(confirm.length).to.equal(1);
    expect(confirm.prop('title')).to.deep.equal(title);
  };

  it('should render', () => {
    const component = renderComponent({ username: 'bill' });

    checkText(component, 'Do you really want to reset the password for ', 'bill', '? You\'ll need a safe way to communicate the new password to your user, never send the user this new password in clear text.');
    checkEmailLabel(component, 'Email');
    checkConnectionLabel(component, 'Connection');
    checkPasswordLabel(component, 'Password (required)');
    checkRepeatPasswordLabel(component, 'Repeat Password (required)');
    checkConfirm(component, 'Change Password?');
  });

  it('should render not applicable language dictionary', () => {
    const languageDictionary = { someKey: 'someValue' };
    const component = renderComponent({ username: 'bill' }, languageDictionary);

    checkText(component, 'Do you really want to reset the password for ', 'bill', '? You\'ll need a safe way to' +
      ' communicate the new password to your user, never send the user this new password in clear text.');
    checkConnectionLabel(component, 'Connection');
    checkEmailLabel(component, 'Email');
    checkPasswordLabel(component, 'Password (required)');
    checkRepeatPasswordLabel(component, 'Repeat Password (required)');
    checkConfirm(component, 'Change Password?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      changePasswordMessage: 'Some pre message {username} ignore second {username}',
      changePasswordTitle: 'Change Password Title'
    };
    const component = renderComponent({ username: 'bob' }, languageDictionary);

    checkText(component, 'Some pre message ', 'bob', ' ignore second {username}');
    checkConfirm(component, 'Change Password Title');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      changePasswordMessage: 'Some other message {   username    }something else'
    };
    const component = renderComponent({ username: 'sally' }, languageDictionary);

    checkText(component, 'Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      changePasswordMessage: 'no username included: '
    };
    const component = renderComponent({ username: 'john' }, languageDictionary);

    checkText(component, 'no username included: ', 'john', '');
  });

  it('should use userFields for whether connection appears', () => {
    const settings = {
      record: {
        settings: {
          userFields: [
            {
              property: 'connection',
              label: 'ConnectionLabel',
              edit: false
            }
          ]
        }
      }
    };
    const component = renderComponent({ username: 'john', settings });
    checkConnectionLabel(component);
  });

  it('should use userFields for label names', () => {
    const settings = {
      record: {
        settings: {
          userFields: [
            {
              property: 'email',
              label: 'EmailLabel',
              edit: {}
            },
            {
              property: 'repeatPassword',
              label: 'Repeat PasswordLabel',
              edit: {}
            },
            {
              property: 'password',
              label: 'PasswordLabel',
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
    const component = renderComponent({ username: 'john', settings });
    checkConnectionLabel(component, 'ConnectionLabel');
    checkEmailLabel(component, 'EmailLabel');
    checkPasswordLabel(component, 'PasswordLabel');
    checkRepeatPasswordLabel(component, 'Repeat PasswordLabel');
  });

  it('should handle null label name in user fields', () => {
    const settings = {
      record: {
        settings: {
          userFields: [
            {
              property: 'password',
              edit: {}
            },
            {
              property: 'repeatPassword',
              edit: {}
            },
            {
              property: 'email',
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
    const component = renderComponent({ username: 'john', settings });
    checkConnectionLabel(component, 'Connection');
    checkEmailLabel(component, 'Email');
    checkPasswordLabel(component, 'Password');
    checkRepeatPasswordLabel(component, 'Repeat Password');
  });
});
