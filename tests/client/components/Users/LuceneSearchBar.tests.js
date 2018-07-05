import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import SearchBar from '../../../../client/components/Users/LuceneSearchBar';

describe('#Client-Components-LuceneSearchBar', () => {
  const renderComponent = (languageDictionary) => {
    return shallow(
      <SearchBar
        enabled={false}
        onReset={() => true}
        onSearch={() => true}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  it('should render', () => {
    const Component = renderComponent();

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find('input').prop('placeholder')).to.equal('Search for users using the Lucene syntax');
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      searchBarPlaceholder: 'Do search a different way'
    };

    const Component = renderComponent(languageDictionary);

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find('input').prop('placeholder')).to.equal(languageDictionary.searchBarPlaceholder);
  });

  it('should render based on languageDictionary but missing loginsCountLabel', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const Component = renderComponent(languageDictionary);

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find('input').prop('placeholder')).to.equal('Search for users using the Lucene syntax');
  });
});
