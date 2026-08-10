import React from 'react';
import moment from 'moment';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import LogDialog from '../../../../client/components/Logs/LogDialog';

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
    return render(
      <LogDialog
        onClose={() => 'close'}
        error={null}
        loading={false}
        log={fromJS(log)}
        logId={log._id}
        settings={{}}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  const checkText = (queries, preText, typeText, buttonText) => {
    expect(queries.getByRole('heading')).to.have.trimmed.text(`${preText} - ${typeText}`);
    expect(queries.getAllByRole('button', { name: buttonText }).length).to.be.greaterThan(0);
  };

  it('should render', () => {
    const queries = renderComponent(success);

    checkText(queries, 'Log', 'Success Exchange (Client Credentials)', 'Close');
  });

  it('should render custom log record', () => {
    const queries = renderComponent(custom);

    checkText(queries, 'Log', 'Log Record', 'Close');
  });

  it('should render not applicable language dictionary', () => {
    const queries = renderComponent(success, { someKey: 'someValue' });

    checkText(queries, 'Log', 'Success Exchange (Client Credentials)', 'Close');
  });

  it('should render language dictionary seccft', () => {
    const languageDictionary = {
      closeButtonText: 'Close Me',
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

    const queries = renderComponent(success, languageDictionary);

    checkText(queries, 'LogTextz', 'Some Title', 'Close Me');
  });

  it('should render language dictionary customLogRecord', () => {
    const languageDictionary = {
      closeButtonText: 'Close Me',
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

    const queries = renderComponent(custom, languageDictionary);

    checkText(queries, 'LogTextz', 'Log Record Text', 'Close Me');
  });

});
