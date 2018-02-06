import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import UserCustomFormFields from '../../../../client/components/Users/UserCustomFormFields';
import UserFormField from '../../../../client/components/Users/UserFormField';

let wrapper = undefined;

const wrapperShallow = (...args) => (wrapper = shallow(...args));

describe('#Client-Components-Users-UserCustomFormFields', () => {
  const renderComponent = (userFields, isEditForm) => {
    return wrapperShallow(
      <UserCustomFormFields
        isEditForm={isEditForm}
        fields={userFields}
      />
    );
  };

  beforeEach(() => {
    wrapper = undefined;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) wrapper.unmount();
  });

  const checkFields = (component, targetFields, isEditForm) => {
    const fields = component.find(UserFormField);
    expect(fields.length).to.equal(targetFields.length);
    targetFields.map((targetField, index) => {
      const field = fields.at(index);
      expect(field.key()).to.equal(index.toString());
      expect(field.prop('field')).to.deep.equal(targetField);
      expect(field.prop('isEditField')).to.equal(isEditForm);
    });
  };

  const dummyFields = [
    { property: 'a' },
    { property: 'b' },
    { property: 'c' },
    { property: 'd' },
  ];


  it('should render edit fields', () => {
    const component = renderComponent(dummyFields, true);
    checkFields(component, dummyFields, true);
  });

  it('should render create fields', () => {
    const component = renderComponent(dummyFields, false);
    checkFields(component, dummyFields, false);
  });
});
