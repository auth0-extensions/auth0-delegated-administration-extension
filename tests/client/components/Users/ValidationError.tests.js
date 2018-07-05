import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import ValidationError from "../../../../client/components/Users/ValidationError";

describe('#Client-Components-ValidationError', () => {

  const renderComponent = (userForm, customFields) => {
    return shallow(
      <ValidationError
        userForm={userForm}
        customFields={customFields}
        errorMessage='Validation Error'
      />
    );
  };

  beforeEach(() => {
  });

  const checkError = (errors, label, property) => {
    const thisError = errors.filterWhere(element => element.prop('htmlFor') === property);
    expect(thisError.length).to.be.greaterThan(0);
    expect(thisError.childAt(0).text()).to.equal(label);
  };

  const checkErrors = (component, targets) => {
    const errors = component.find('label');

    for (let i = 0; i < targets.length; i++) {
      checkError(errors, targets[i].label, targets[i].property);
    }
  };

  it('should render', () => {
    const userForm = {
      user: {
        submitFailed: true,
        syncErrors: {
          email: 'required',
          app_metadata: {
            address: {
              city: 'required'
            }
          }
        }
      }
    };

    const customFields = [{
      property: 'app_metadata.address.city',
      label: 'City'
    }];

    const component = renderComponent(userForm, customFields);
    const targets = [{
        label: 'email',
        property: 'email'
      },
      {
        label: 'City',
        property: 'app_metadata.address.city'
      }];

    expect(component.length).to.be.greaterThan(0);

    checkErrors(component, targets);
  });

  it('should render empty if not submitted', () => {
    const userForm = {
      user: {
        submitFailed: false,
        syncErrors: {
          email: 'required'
        }
      }
    };

    const component = renderComponent(userForm, []);

    expect(component.length).to.be.greaterThan(0);
    expect(component.html()).to.equal('<div></div>');
  });

  it('should render empty if no errors', () => {
    const userForm = {
      user: {
        submitFailed: true
      }
    };

    const component = renderComponent(userForm, []);

    expect(component.length).to.be.greaterThan(0);
    expect(component.html()).to.equal('<div></div>');
  });
});
