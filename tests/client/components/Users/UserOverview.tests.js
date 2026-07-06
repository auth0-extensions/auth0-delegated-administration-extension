import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { SearchBar } from 'auth0-extension-ui';

import UserOverview from '../../../../client/components/Users/UserOverview';
import LuceneSearchBar from '../../../../client/components/Users/LuceneSearchBar';
import UsersTable from '../../../../client/components/Users/UsersTable';

describe('#Client-Components-UserOverview', () => {
  const renderComponent = (languageDictionary, props) => {
    return shallow(
      <UserOverview
        loading={false}
        error={null}
        onReset={() => 'onReset'}
        onSearch={() => 'onSearch'}
        onPageChange={() => 'onPageChange'}
        onColumnSort={() => 'onColumnSort'}
        users={[{ username: 'bill'}]}
        userFields={[]}
        sortOrder={1}
        sortProperty={'username'}
        settings={{}}
        languageDictionary={languageDictionary}
        {...props}
      />
    );
  };

  beforeEach(() => {
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

    const component = renderComponent(languageDictionary);
    expect(component.length).to.be.greaterThan(0);

    const searchBar = component.find(LuceneSearchBar);
    expect(searchBar.length).to.equal(1);
    expect(searchBar.prop('languageDictionary')).to.deep.equal(languageDictionary);

    const usersTable = component.find(UsersTable);
    expect(usersTable.length).to.equal(1);
    expect(usersTable.prop('languageDictionary')).to.deep.equal(languageDictionary);
  });

  it('should pass searchValue to LuceneSearchBar when there are no filterable user fields', () => {
    const component = renderComponent({}, { searchValue: 'email:john' });
    const searchBar = component.find(LuceneSearchBar);

    expect(searchBar.length).to.equal(1);
    expect(searchBar.prop('searchValue')).to.equal('email:john');

    component.setProps({ searchValue: 'email:jane' });
    expect(component.find(LuceneSearchBar).prop('searchValue')).to.equal('email:jane');
  });

  it('should pass searchValue and selectedFilter to SearchBar when filterable user fields are configured', () => {
    const userFields = [
      {
        label: 'Contact ID',
        property: 'app_metadata.contactId',
        search: { filter: true }
      },
      {
        label: 'Email',
        property: 'email',
        search: { filter: true }
      }
    ];
    const component = renderComponent({}, {
      searchValue: 'foo123',
      selectedFilter: 'app_metadata.contactId',
      userFields
    });
    const searchBar = component.find(SearchBar);

    expect(searchBar.length).to.equal(1);
    expect(searchBar.prop('searchValue')).to.equal('foo123');
    expect(searchBar.prop('searchOptions')).to.deep.equal([
      {
        title: 'Contact ID',
        value: 'app_metadata.contactId',
        filterBy: 'app_metadata.contactId',
        selected: true
      },
      {
        title: 'Email',
        value: 'email',
        filterBy: 'email',
        selected: false
      }
    ]);

    component.setProps({ searchValue: 'bar456', selectedFilter: 'email' });
    const updatedSearchBar = component.find(SearchBar);
    expect(updatedSearchBar.prop('searchValue')).to.equal('bar456');
    expect(updatedSearchBar.prop('searchOptions')).to.deep.equal([
      {
        title: 'Contact ID',
        value: 'app_metadata.contactId',
        filterBy: 'app_metadata.contactId',
        selected: false
      },
      {
        title: 'Email',
        value: 'email',
        filterBy: 'email',
        selected: true
      }
    ]);
  });
});
