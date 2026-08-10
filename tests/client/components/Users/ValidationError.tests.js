import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import ValidationError from "../../../../client/components/Users/ValidationError";

describe('#Client-Components-ValidationError', () => {

  const renderComponent = (userForm, customFields) => {
    return render(
      <ValidationError
        userForm={userForm}
        customFields={customFields}
        errorMessage='Validation Error'
      />
    );
  };

  const checkError = (errors, label, property) => {
    const thisError = errors.filter(element => element.getAttribute('for') === property);
    expect(thisError.length).to.be.greaterThan(0);
    expect(thisError[0]).to.have.trimmed.text(label);
  };

  const checkErrors = (queries, targets) => {
    const errors = Array.from(queries.container.querySelectorAll('label'));

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

    const queries = renderComponent(userForm, customFields);
    const targets = [{
        label: 'email',
        property: 'email'
      },
      {
        label: 'City',
        property: 'app_metadata.address.city'
      }];

    checkErrors(queries, targets);
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

    const { container } = renderComponent(userForm, []);

    expect(container.innerHTML).to.equal('<div></div>');
  });

  it('should render empty if no errors', () => {
    const userForm = {
      user: {
        submitFailed: true
      }
    };

    const { container } = renderComponent(userForm, []);

    expect(container.innerHTML).to.equal('<div></div>');
  });
});
