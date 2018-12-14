import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import { Confirm } from 'auth0-extension-ui';

import fakeStore from '../../../../utils/fakeStore';

import PasswordResetDialog from '../../../../../client/containers/Users/Dialogs/PasswordResetDialog';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args));

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
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <PasswordResetDialog
          cancelPasswordReset={() => null}
          resetPassword={() => null}
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

  const checkClientLabel = (component, passwordLabel) => {
    expect(document.querySelector('label[for=client]')
      .textContent).to.equal(passwordLabel);
  };

  const checkConfirm = (component, title) => {
    const confirm = component.find(Confirm);
    expect(confirm.length).to.equal(1);
    expect(confirm.prop('title')).to.deep.equal(title);
  };

  it('should render', () => {
    const component = renderComponent({ username: 'bill' });

    checkText(component, 'Do you really want to reset the password for ', 'bill', '? This will send an email to the' +
      ' user allowing them to choose a new password.');
    checkConnectionLabel(component, 'Connection');
    checkEmailLabel(component, 'Email');
    checkClientLabel(component, 'Client (required)');
    checkConfirm(component, 'Reset Password?');
  });

  it('should render without connection field', () => {
    const component = renderComponent({ username: 'bill', connections: [ { name: 'connA' } ] });

    checkText(component, 'Do you really want to reset the password for ', 'bill', '? This will send an email to the' +
      ' user allowing them to choose a new password.');
    checkConnectionLabel(component);
    checkEmailLabel(component, 'Email');
    checkClientLabel(component, 'Client (required)');
    checkConfirm(component, 'Reset Password?');
  });

  it('should render not applicable language dictionary', () => {
    const languageDictionary = { someKey: 'someValue' };
    const component = renderComponent({ username: 'bill' }, languageDictionary);

    checkText(component, 'Do you really want to reset the password for ', 'bill', '? This will send an email to the' +
      ' user allowing them to choose a new password.');
    checkConnectionLabel(component, 'Connection');
    checkEmailLabel(component, 'Email');
    checkClientLabel(component, 'Client (required)');
    checkConfirm(component, 'Reset Password?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      resetPasswordMessage: 'Some pre message {username} ignore second {username}',
      resetPasswordTitle: 'Reset Password Title'
    };
    const component = renderComponent({ username: 'bob' }, languageDictionary);

    checkText(component, 'Some pre message ', 'bob', ' ignore second {username}');
    checkConfirm(component, 'Reset Password Title');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      resetPasswordMessage: 'Some other message {   username    }something else'
    };
    const component = renderComponent({ username: 'sally' }, languageDictionary);

    checkText(component, 'Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      resetPasswordMessage: 'no username included: '
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
    const component = renderComponent({ username: 'john', settings });
    checkConnectionLabel(component, 'ConnectionLabel');
    checkEmailLabel(component, 'EmailLabel');
    checkClientLabel(component, 'ClientLabel');
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
    const component = renderComponent({ username: 'john', settings });
    checkConnectionLabel(component, 'Connection');
    checkEmailLabel(component, 'Email');
    checkClientLabel(component, 'Client');
  });
});
