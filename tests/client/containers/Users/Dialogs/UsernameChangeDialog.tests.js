import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import fakeStore from '../../../../utils/fakeStore';

import UsernameChangeDialog from '../../../../../client/containers/Users/Dialogs/UsernameChangeDialog';

describe('#Client-Containers-Users-Dialogs-UsernameChangeDialog', () => {

  const renderComponent = (options, languageDictionary) => {
    options = options || {};
    const initialState = {
      usernameChange: fromJS({
        user: { name: options.username },
        error: null,
        requesting: true,
        loading: false,
        connection: 'connA'
      }),
      connections: fromJS({
        records: options.connections || [ { name: 'connA', options: { requires_username: true } }, { name: 'connB' } ]
      }),
      languageDictionary: fromJS({
        record: languageDictionary || {}
      }),
      settings: fromJS(options.settings || {})
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <UsernameChangeDialog
          cancelUsernameChange={() => null}
          usernameChange={() => null}
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

  const checkUsernameLabel = (usernameLabel) => {
    expect(document.querySelector('label[for=username]')
      .textContent).to.equal(usernameLabel);
  };

  const checkConfirm = (title) => {
    const modalTitle = document.querySelector('.modal-title');
    expect(modalTitle).to.exist;
    expect(modalTitle.textContent).to.equal(title);
  };

  it('should render', () => {
    renderComponent({ username: 'bill' });

    checkText('Do you really want to change the username for ', 'bill', '?');
    checkConnectionLabel('Connection');
    checkUsernameLabel('Username (required)');
    checkConfirm('Change Username?');
  });

  it('should render without connection field', () => {
    renderComponent(
      {
        username: 'bill',
        connections: [ { name: 'connA', options: { requires_username: true } } ]
      });

    checkText('Do you really want to change the username for ', 'bill', '?');
    checkConnectionLabel(undefined);
    checkUsernameLabel('Username (required)');
    checkConfirm('Change Username?');
  });

  it('should render not applicable language dictionary', () => {
    renderComponent({ username: 'bill' }, { someKey: 'someValue' });

    checkText('Do you really want to change the username for ', 'bill', '?');
    checkConnectionLabel('Connection');
    checkUsernameLabel('Username (required)');
    checkConfirm('Change Username?');
  });

  it('should render applicable language dictionary', () => {
    const languageDictionary = {
      changeUsernameMessage: 'Some pre message {username} ignore second {username}',
      changeUsernameTitle: 'Change Username Title'
    };
    renderComponent({ username: 'bob' }, languageDictionary);

    checkText('Some pre message ', 'bob', ' ignore second {username}');
  });

  it('should render applicable language dictionary spaces in username', () => {
    const languageDictionary = {
      changeUsernameMessage: 'Some other message {   username    }something else'
    };
    renderComponent({ username: 'sally' }, languageDictionary);

    checkText('Some other message ', 'sally', 'something else');
  });

  it('should render applicable language dictionary no username', () => {
    const languageDictionary = {
      changeUsernameMessage: 'no username included: '
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
    renderComponent({ username: 'john', settings });
    checkConnectionLabel(undefined);

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
    renderComponent({ username: 'bill', settings });
    checkConnectionLabel('ConnectionLabel');

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
    renderComponent({ username: 'bill', settings });
    checkConnectionLabel('Connection');
  });
});
