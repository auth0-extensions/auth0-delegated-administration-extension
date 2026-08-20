import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

import UserHeader from '../../../../client/components/Users/UserHeader';

describe('#Client-Components-UserHeader', () => {
  const renderComponent = (languageDictionary) => {
    const user = {
      name: 'bill',
      email: 'bill@mostek.com'
    };

    return render(
      <UserHeader
        error={null}
        loading={false}
        user={fromJS(user)}
        userFields={[]}
        languageDictionary={languageDictionary}
      />
    );
  };

  beforeEach(() => {
  });

  it('should render', () => {
    const { getByText } = renderComponent();

    expect(getByText('Logins Count:')).to.exist;
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      loginsCountLabel: 'Some Logins Count Label:'
    };

    const { getByText } = renderComponent(languageDictionary);

    expect(getByText(languageDictionary.loginsCountLabel)).to.exist;
  });

  it('should render based on languageDictionary but missing loginsCountLabel', () => {
    const languageDictionary = {
      someOtherKey: 'Some Logins Count Label:'
    };

    const { getByText } = renderComponent(languageDictionary);

    expect(getByText('Logins Count:')).to.exist;
  });
});
