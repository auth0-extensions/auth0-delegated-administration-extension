import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import proxyquire from 'proxyquire';

/* Record the props each UserFormField receives so we can assert what UserCustomFormFields passes down. */
let captured = [];
const StubField = (props) => {
  captured.push(props);
  return null;
};

const UserCustomFormFields = proxyquire(
  '../../../../client/components/Users/UserCustomFormFields',
  { './UserFormField': { '__esModule': true, default: StubField } }
).default;

describe('#Client-Components-Users-UserCustomFormFields', () => {
  const renderComponent = (userFields, isEditForm) => {
    return render(
      <UserCustomFormFields
        isEditForm={isEditForm}
        fields={userFields}
      />
    );
  };

  beforeEach(() => {
    captured = [];
    document.body.innerHTML = '';
  });

  const checkFields = (targetFields, isEditForm) => {
    expect(captured.length).to.equal(targetFields.length);
    targetFields.forEach((targetField, index) => {
      expect(captured[index].field).to.deep.equal(targetField);
      expect(captured[index].isEditField).to.equal(isEditForm);
    });
  };

  const dummyFields = [
    { property: 'a' },
    { property: 'b' },
    { property: 'c' },
    { property: 'd' },
  ];


  it('should render edit fields', () => {
    renderComponent(dummyFields, true);
    checkFields(dummyFields, true);
  });

  it('should render create fields', () => {
    renderComponent(dummyFields, false);
    checkFields(dummyFields, false);
  });
});
