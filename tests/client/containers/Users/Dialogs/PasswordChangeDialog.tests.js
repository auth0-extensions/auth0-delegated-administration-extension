import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import PasswordChangeDialog from '../../../../../client/containers/Users/Dialogs/PasswordChangeDialog';

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
    return render(
      <Provider store={fakeStore(initialState)}>
        <PasswordChangeDialog
          cancelPasswordChange={() => null}
          changePassword={() => null}
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

  const checkConnectionLabel = (connectionLabel) => {
    if (connectionLabel) {
      const label = document.querySelector('label[for=connection]');
      expect(label).to.not.be.null;
      expect(label.textContent).to.equal(connectionLabel);
    } else {
      expect(document.querySelector('label[for=connection]')).to.be.null;
    }
  };

  const checkEmailLabel = (emailLabel) => {
    const label = document.querySelector('label[for=email]');
    expect(label).to.not.be.null;
    expect(label.textContent).to.equal(emailLabel);
  };

  const checkPasswordLabel = (passwordLabel) => {
    const label = document.querySelector('label[for=password]');
    expect(label).to.not.be.null;
    expect(label.textContent).to.equal(passwordLabel);
  };

  const checkRepeatPasswordLabel = (passwordLabel) => {
    const label = document.querySelector('label[for=repeatPassword]');
    expect(label).to.not.be.null;
    expect(label.textContent).to.equal(passwordLabel);
  };

  const checkConfirm = (title) => {
    const modalTitle = document.querySelector('.modal-title');
    expect(modalTitle).to.exist;
    expect(modalTitle.textContent).to.equal(title);
  };

  it('should render', () => {
    renderComponent({ username: 'bill' });

    checkText('Do you really want to reset the password for ', 'bill', '? You\'ll need a safe way to communicate the new password to your user, never send the user this new password in clear text.');
    checkEmailLabel('Email');
    checkConnectionLabel('Connection');
    checkPasswordLabel('Password (required)');
    checkRepeatPasswordLabel('Repeat Password (required)');
    checkConfirm('Change Password?');
  });

  it('should render not applicable language dictionary', () => {
    const languageDictionary = { someKey: 'someValue' };
    renderComponent({ username: 'bill' }, languageDictionary);

    checkText('Do you really want to reset the password for ', 'bill', '? You\'ll need a safe way to' +
      ' communicate the new password to your user, never send the user this new password in clear text.');
    checkConnectionLabel('Connection');
    checkEmailLabel('Email');
    checkPasswordLabel('Password (required)');
    checkRepeatPasswordLabel('Repeat Password (required)');
    checkConfirm('Change Password?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      changePasswordMessage: 'Some pre message {username} ignore second {username}',
      changePasswordTitle: 'Change Password Title'
    };
    renderComponent({ username: 'bob' }, languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
    checkConfirm('Change Password Title');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      changePasswordMessage: 'Some other message {   username    }something else'
    };
    renderComponent({ username: 'sally' }, languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      changePasswordMessage: 'no username included: '
    };
    renderComponent({ username: 'john' }, languageDictionary);

    checkText('no username included: ', 'john', '');
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
    renderComponent({ username: 'john', settings });
    checkConnectionLabel(undefined);
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
    renderComponent({ username: 'john', settings });
    checkConnectionLabel('ConnectionLabel');
    checkEmailLabel('EmailLabel');
    checkPasswordLabel('PasswordLabel');
    checkRepeatPasswordLabel('Repeat PasswordLabel');
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
    renderComponent({ username: 'john', settings });
    checkConnectionLabel('Connection');
    checkEmailLabel('Email');
    checkPasswordLabel('Password');
    checkRepeatPasswordLabel('Repeat Password');
  });
});
