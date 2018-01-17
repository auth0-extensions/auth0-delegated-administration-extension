import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Button } from 'react-bootstrap';
import fakeStore from '../../../utils/fakeStore';
import UserFieldsChangeForm from '../../../../client/components/Users/UserFieldsChangeForm';

describe('#Client-Components-UserFieldsChangeForm', () => {
  const renderComponent = (languageDictionary) => {
    return mount(
      <Provider store={fakeStore({})}>
        <UserFieldsChangeForm
          onClose={()=>'onClose'}
          handleSubmit={()=>'handleSubmit'}
          customFieldGetter={()=>'customFieldGetter'}
          submitting={false}
          languageDictionary={languageDictionary}
        />
      </Provider>
    );
  };

  beforeEach(() => {
  });

  it('should render', () => {
    const Component = renderComponent();

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find(Button).filterWhere(element =>
      element.text() === 'Cancel').length).to.equal(1);
    expect(Component.find(Button).filterWhere(element => element.text() === 'Update').length).to.equal(1);
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      cancelButtonText: 'CancelButton',
      updateButtonText: 'UpdateButton'
    };

    const Component = renderComponent(languageDictionary);

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find(Button).filterWhere(element => element.text() === 'CancelButton').length).to.equal(1);
    expect(Component.find(Button).filterWhere(element => element.text() === 'UpdateButton').length).to.equal(1);
  });

  it('should render based on languageDictionary but missing button labels', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const Component = renderComponent(languageDictionary);

    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find(Button).filterWhere(element => element.text() === 'Cancel').length).to.equal(1);
    expect(Component.find(Button).filterWhere(element => element.text() === 'Update').length).to.equal(1);
  });
});
