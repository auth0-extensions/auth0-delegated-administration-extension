import React from 'react';
import { shallow } from 'enzyme';
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

    return shallow(
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
    const Component = renderComponent();

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find('span.lined-text').text()).to.equal('Logins Count:');
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      loginsCountLabel: 'Some Logins Count Label:'
    };

    const Component = renderComponent(languageDictionary);

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find('span.lined-text').text()).to.equal(languageDictionary.loginsCountLabel);
  });

  it('should render based on languageDictionary but missing loginsCountLabel', () => {
    const languageDictionary = {
      someOtherKey: 'Some Logins Count Label:'
    };

    const Component = renderComponent(languageDictionary);

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find('span.lined-text').text()).to.equal('Logins Count:');
  });
});
