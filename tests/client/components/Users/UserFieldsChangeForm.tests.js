import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Button } from 'react-bootstrap';
import fakeStore from '../../../utils/fakeStore';
import UserFieldsChangeForm from '../../../../client/components/Users/UserFieldsChangeForm';
import UserCustomFormFields from '../../../../client/components/Users/UserCustomFormFields';

describe('#Client-Components-UserFieldsChangeForm', () => {
  const renderComponent = (languageDictionary, customFields) => {
    const fields = customFields || [{property: 'someField', edit: true}];
    return mount(
      <Provider store={fakeStore({})}>
        <UserFieldsChangeForm
          onClose={()=>'onClose'}
          handleSubmit={()=>'handleSubmit'}
          submitting={false}
          languageDictionary={languageDictionary}
          customFields={fields}
        />
      </Provider>
    );
  };

  beforeEach(() => {
  });

  const checkButtons = (component, cancel, update) => {
    expect(component.length).to.be.greaterThan(0);
    expect(component.find(Button).filterWhere(element =>
      element.text() === cancel).length).to.equal(1);
    expect(component.find(Button).filterWhere(element => element.text() === update).length).to.equal(1);
  };

  const checkForm = (component, formExists) => {
    const form = component.find(UserCustomFormFields);
    expect(form.length).to.equal(formExists ? 1 : 0);
  };

  it('should render', () => {
    const provider = renderComponent();
    checkButtons(provider, 'Cancel', 'Update');
    checkForm(provider, true);
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      cancelButtonText: 'CancelButton',
      updateButtonText: 'UpdateButton'
    };

    const provider = renderComponent(languageDictionary);
    checkButtons(provider, 'CancelButton', 'UpdateButton');
    checkForm(provider, true);
  });

  it('should render based on languageDictionary but missing button labels', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const provider = renderComponent(languageDictionary);
    checkButtons(provider, 'Cancel', 'Update');
    checkForm(provider, true);
  });

  it('should not render if there are no custom fields', () => {
    const provider = renderComponent({}, []);
    checkForm(provider, false);
  });

  it('should not render if the custom fields dont edit', () => {
    const provider = renderComponent({}, [{ property: 'do.not.edit.me', edit: false }, { property: 'do.not.edit.me.either' }]);
    checkForm(provider, false);
  });

});
