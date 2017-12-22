import React from 'react';
import moment from 'moment';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import LogDialog from '../../../../client/components/Logs/LogDialog';
import { Button, Modal } from 'react-bootstrap';

describe('#Client-Components-Logs-LogDialog', () => {

  const success = {
    "_id": "5a393f798d579955398af165",
    "audience": "https://acces.dev.auth0.com/api/v2/",
    "client_id": "UYpkSYY5Zawt13cDHwwHRfDnNThZh2c3",
    "client_name": "auth0-delegated-admin",
    "connection": null,
    "connection_id": "",
    "date": "2017-12-19T16:34:01.319Z",
    "description": "",
    "ip": "68.47.31.102",
    "scope": null,
    "shortType": "seccft",
    "type": "Success Exchange (Client Credentials)",
    "user_agent": "node-superagent/2.3.0",
    "user_id": "",
    "user_name": ""
  };

  const fail = {
    "_id": "5a393f798d579955398af165",
    "audience": "https://acces.dev.auth0.com/api/v2/",
    "client_id": "UYpkSYY5Zawt13cDHwwHRfDnNThZh2c3",
    "client_name": "auth0-delegated-admin",
    "connection": null,
    "connection_id": "",
    "date": "2017-12-19T16:34:01.319Z",
    "description": "",
    "ip": "68.47.31.102",
    "scope": null,
    "shortType": "fapi",
    "type": "Failed API",
    "user_agent": "node-superagent/2.3.0",
    "user_id": "",
    "user_name": ""
  };

  const custom = {
    "_id": "5a393f798d579955398af165",
    "audience": "https://acces.dev.auth0.com/api/v2/",
    "client_id": "UYpkSYY5Zawt13cDHwwHRfDnNThZh2c3",
    "client_name": "auth0-delegated-admin",
    "connection": null,
    "connection_id": "",
    "date": "2017-12-19T16:34:01.319Z",
    "description": "",
    "ip": "68.47.31.102",
    "scope": null,
    "shortType": "custom",
    "user_agent": "node-superagent/2.3.0",
    "user_id": "",
    "user_name": ""
  };

  const renderComponent = (log, languageDictionary) => {
    return shallow(
      <LogDialog
        onClose={() => 'close'}
        error={null}
        loading={false}
        log={fromJS(log)}
        logId={log._id}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const checkText = (component, preText, typeText, buttonText) => {
    const title = component.find(Modal.Title);
    expect(title.length).to.equal(1);
    expect(title.childAt(0).text()).to.equal(preText);
    expect(title.childAt(2).text()).to.equal(typeText);

    const button = component.find(Button);
    expect(button.length).to.equal(1);
    expect(button.childAt(2).text()).to.equal(buttonText);
  };

  it('should render', () => {
    const component = renderComponent(success);

    checkText(component, 'Log', 'Success Exchange (Client Credentials)', 'Close');
  });

  it('should render custom log record', () => {
    const component = renderComponent(custom);

    checkText(component, 'Log', 'Log Record', 'Close');
  });

  it('should render not applicable language dictionary', () => {
    const component = renderComponent(success, { someKey: 'someValue' });

    checkText(component, 'Log', 'Success Exchange (Client Credentials)', 'Close');
  });

  it('should render language dictionary seccft', () => {
    const languageDictionary = {
      closeButtonLabel: 'Close Me',
      logDialogTitleText: 'LogTextz',
      logTypes: {
        'seccft': {
          event: 'Some Title'
        },
        'fapi': {
          event: 'Some Failed API Title'
        }
      }
    };

    const component = renderComponent(success, languageDictionary);

    checkText(component, 'LogTextz', 'Some Title', 'Close Me');
  });

  it('should render language dictionary customLogRecord', () => {
    const languageDictionary = {
      closeButtonLabel: 'Close Me',
      logDialogTitleText: 'LogTextz',
      logDialogDefaultLogRecordText: 'Log Record Text',
      logTypes: {
        'seccft': {
          event: 'Some Title'
        },
        'fapi': {
          event: 'Some Failed API Title'
        }
      }
    };

    const component = renderComponent(custom, languageDictionary);

    checkText(component, 'LogTextz', 'Log Record Text', 'Close Me');
  });

});
