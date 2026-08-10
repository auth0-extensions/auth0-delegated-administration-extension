import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MemoryRouter } from 'react-router-dom';

import TabsHeader from '../../../client/components/TabsHeader';

describe('#Client-Components-TabsHeader', () => {
  const renderComponent = (role, languageDictionary) => {

    return render(
      <MemoryRouter>
        <TabsHeader
          role={role}
          languageDictionary={languageDictionary}
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
  });

  const checkPanes = (queries, userTitle, logsTitle) => {
    const tabs = queries.getAllByRole('link');
    expect(tabs).to.have.length(logsTitle ? 2 : 1);
    expect(tabs[0]).to.have.trimmed.text(userTitle);
    if (logsTitle) expect(tabs[1]).to.have.trimmed.text(logsTitle);
  };

  it('should render admin', () => {
    checkPanes(renderComponent(2), 'Users', 'Logs');
  });

  it('should render non-admin', () => {
    checkPanes(renderComponent(1), 'Users');
  });

  it('should render tab names from languageDictionary for admin', () => {
    checkPanes(renderComponent(2, {
      userUsersTabTitle: 'Users Title',
      userLogsTabTitle: 'Logs Title'
    }), 'Users Title', 'Logs Title');
  });

  it('should render tab names from languageDictionary for non-admin', () => {
    checkPanes(renderComponent(1, {
      userUsersTabTitle: 'Users Title',
      userLogsTabTitle: 'Logs Title'
    }), 'Users Title');
  });
});
