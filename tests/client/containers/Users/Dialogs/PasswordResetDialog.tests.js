import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import PasswordResetDialog from '../../../../../client/containers/Users/Dialogs/PasswordResetDialog';

describe('#Client-Containers-Users-Dialogs-PasswordResetDialog', () => {

  const renderComponent = (options, languageDictionary) => {
    options = options || {};
    const initialState = {
      passwordReset: fromJS({
        user: { name: options.username, email: 'four@horseman.com' },
        error: null,
        requesting: true,
        loading: false,
        connection: 'connA'
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS(options.settings || {}),
      connections: fromJS({
        records: options.connections || [ { name: 'connA' }, { name: 'connB' } ]
      }),
      user: fromJS({
        connection: {
          name: 'connA',
          enabled_clients: [ 1, 2 ]
        }
      }),
      applications: fromJS({
        records: [
          {
            name: 'app1',
            client_id: 1
          }, {
            name: 'app2',
            client_id: 2
          }]
      })
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <PasswordResetDialog
          cancelPasswordReset={() => null}
          resetPassword={() => null}
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

  const checkClientLabel = (clientLabel) => {
    const label = document.querySelector('label[for=client]');
    expect(label).to.not.be.null;
    expect(label.textContent).to.equal(clientLabel);
  };

  const checkConfirm = (title) => {
    const modalTitle = document.querySelector('.modal-title');
    expect(modalTitle).to.exist;
    expect(modalTitle.textContent).to.equal(title);
  };

  it('should render', () => {
    renderComponent({ username: 'bill' });

    checkText('Do you really want to reset the password for ', 'bill', '? This will send an email to the' +
      ' user allowing them to choose a new password.');
    checkConnectionLabel('Connection');
    checkEmailLabel('Email');
    checkClientLabel('Client');
    checkConfirm('Reset Password?');
  });

  it('should render without connection field', () => {
    renderComponent({ username: 'bill', connections: [ { name: 'connA' } ] });

    checkText('Do you really want to reset the password for ', 'bill', '? This will send an email to the' +
      ' user allowing them to choose a new password.');
    checkConnectionLabel(undefined);
    checkEmailLabel('Email');
    checkClientLabel('Client');
    checkConfirm('Reset Password?');
  });

  it('should render not applicable language dictionary', () => {
    const languageDictionary = { someKey: 'someValue' };
    renderComponent({ username: 'bill' }, languageDictionary);

    checkText('Do you really want to reset the password for ', 'bill', '? This will send an email to the' +
      ' user allowing them to choose a new password.');
    checkConnectionLabel('Connection');
    checkEmailLabel('Email');
    checkClientLabel('Client');
    checkConfirm('Reset Password?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      resetPasswordMessage: 'Some pre message {username} ignore second {username}',
      resetPasswordTitle: 'Reset Password Title'
    };
    renderComponent({ username: 'bob' }, languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
    checkConfirm('Reset Password Title');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      resetPasswordMessage: 'Some other message {   username    }something else'
    };
    renderComponent({ username: 'sally' }, languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      resetPasswordMessage: 'no username included: '
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
              property: 'client',
              label: 'ClientLabel',
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
    checkClientLabel('ClientLabel');
  });

  it('should handle null label name in user fields', () => {
    const settings = {
      record: {
        settings: {
          userFields: [
            {
              property: 'client',
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
    checkClientLabel('Client');
  });
});
