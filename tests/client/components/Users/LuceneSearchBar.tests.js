import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import SearchBar from '../../../../client/components/Users/LuceneSearchBar';

describe('#Client-Components-LuceneSearchBar', () => {
  const renderComponent = (languageDictionary) => {
    return render(
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
    const { getByPlaceholderText } = renderComponent();

    expect(getByPlaceholderText('Search for users using the Lucene syntax')).to.exist;
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      searchBarPlaceholder: 'Do search a different way'
    };

    const { getByPlaceholderText } = renderComponent(languageDictionary);

    expect(getByPlaceholderText(languageDictionary.searchBarPlaceholder)).to.exist;
  });

  it('should render based on languageDictionary but missing loginsCountLabel', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const { getByPlaceholderText } = renderComponent(languageDictionary);

    expect(getByPlaceholderText('Search for users using the Lucene syntax')).to.exist;
  });
});
