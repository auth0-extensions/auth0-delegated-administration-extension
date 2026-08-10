import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import EmailChangeDialog from '../../../../../client/containers/Users/Dialogs/EmailChangeDialog';

describe('#Client-Containers-Users-Dialogs-EmailChangeDialog', () => {

  const renderComponent = (options, languageDictionary) => {
    options = options || {};
    const initialState = {
      emailChange: fromJS({
        user: {
          user_id: 1,
          name: options.username,
          email: 'four@horseman.com'
        },
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
        <EmailChangeDialog
          cancelEmailChange={() => null}
          changeEmail={() => null}
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
      expect(document.querySelector('label[for=connection]')
        .textContent).to.equal(connectionLabel);
    } else {
      expect(document.querySelector('label[for=connection]')).to.be.null;
    }
  };

  const checkEmailLabel = (emailLabel) => {
    expect(document.querySelector('label[for=email]')
      .textContent).to.equal(emailLabel);
  };

  const checkConfirm = (title) => {
    const modalTitle = document.querySelector('.modal-title');
    expect(modalTitle).to.exist;
    expect(modalTitle.textContent).to.equal(title);
  };

  it('should render', () => {
    renderComponent({ username: 'bill' });

    checkText('Do you really want to change the email for ', 'bill', '?');
    checkConnectionLabel('Connection');
    checkEmailLabel('Email (required)');
    checkConfirm('Change Email?');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent({ username: 'bill' }, { someKey: 'someValue' });

    checkText('Do you really want to change the email for ', 'bill', '?');
    checkConnectionLabel('Connection');
    checkEmailLabel('Email (required)');
    checkConfirm('Change Email?');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent({ username: 'bill' }, { someKey: 'someValue' });

    checkText('Do you really want to change the email for ', 'bill', '?');
    checkConnectionLabel('Connection');
    checkEmailLabel('Email (required)');
    checkConfirm('Change Email?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      changeEmailMessage: 'Some pre message {username} ignore second {username}',
      changeEmailTitle: 'Change Email Title'
    };
    renderComponent({ username: 'bob' }, languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      changeEmailMessage: 'Some other message {   username    }something else'
    };
    renderComponent({ username: 'sally' }, languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      changeEmailMessage: 'no username included: '
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
              property: 'email',
              label: 'EmailLabel',
              edit: true
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
  });

  it('should handle null label name in user fields', () => {
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
              property: 'connection',
              edit: {}
            }
          ]
        }
      }
    };
    renderComponent({ username: 'john', settings });
    checkConnectionLabel('Connection');
  });
});
