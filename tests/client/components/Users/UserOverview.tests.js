import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import proxyquire from 'proxyquire';

/* Record the props the child components receive so we can assert what UserOverview passes down. */
let captured = {};
const StubChild = (name) => (props) => {
  captured[name] = (captured[name] || []).concat(props);
  return null;
};

const UserOverview = proxyquire(
  '../../../../client/components/Users/UserOverview',
  { './': { LuceneSearchBar: StubChild('LuceneSearchBar'), UsersTable: StubChild('UsersTable') } }
).default;

describe('#Client-Components-UserOverview', () => {
  const renderComponent = (languageDictionary) => {
    return render(
      <UserOverview
        loading={false}
        error={null}
        onReset={() => 'onReset'}
        onSearch={() => 'onSearch'}
        onPageChange={() => 'onPageChange'}
        onColumnSort={() => 'onColumnSort'}
        users={[{ username: 'bill' }]}
        userFields={[]}
        sortOrder={1}
        sortProperty={'username'}
        settings={{}}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
    captured = {};
  });

  it('should pass language dictionary', () => {
    const languageDictionary = {
      logEventColumnHeader: 'EventHeader',
      logDescriptionColumnHeader: 'DescriptionHeader',
      logDateColumnHeader: 'DateHeader',
      logConnectionColumnHeader: 'ConnectionHeader',
      logApplicationColumnHeader: 'ApplicationHeader',
      momentLocale: 'fr',
      notApplicableLabel: 'Not Applicable'
    };

    renderComponent(languageDictionary);

    expect(captured.LuceneSearchBar).to.have.length(1);
    expect(captured.LuceneSearchBar[0].languageDictionary).to.deep.equal(languageDictionary);

    expect(captured.UsersTable).to.have.length(1);
    expect(captured.UsersTable[0].languageDictionary).to.deep.equal(languageDictionary);
  });
});
