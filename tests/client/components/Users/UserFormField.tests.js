import _ from 'lodash';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { reduxForm, Field } from 'redux-form';
import { InputText, InputCombo, Multiselect, Select } from 'auth0-extension-ui';

import fakeStore from '../../../utils/fakeStore';
import UserFormField from '../../../../client/components/Users/UserFormField';

let wrapper = undefined;

const wrapperMount = (...args) => (wrapper = mount(...args));

class TestForm extends Component {
  render() {
    return <UserFormField
      {...this.props}
    />
  }
};

const TestFormWrapper = reduxForm({ form: 'test' })(TestForm);

describe('#Client-Components-Users-UserFormField', () => {
  const renderComponent = (field, isEditField, languageDictionary) => {
    const initialState = {
      form: {
        test: {
        }
      }
    };
    return wrapperMount(
      <Provider store={fakeStore(initialState)}>
        <TestFormWrapper
          field={field}
          isEditField={isEditField}
          languageDictionary={languageDictionary}
        />
      </Provider>);
  };

  beforeEach(() => {
    wrapper = undefined;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) wrapper.unmount();
  });

  const typeMap = {
    'InputText': { type: 'text', component: InputText },
    'InputCombo': { type: 'select', component: InputCombo },
    'InputMultiCombo': { type: 'select', component: Multiselect },
    'InputSelectCombo': { type: 'select', component: Select }
  };

  const checkField = (component, fieldProps, label, type, isEdit, requiredLabel) => {
    requiredLabel = requiredLabel || ' (required)';
    const field = component.find(Field);
    expect(field.length).to.equal(1);

    const formType = isEdit ? 'edit' : 'create';

    const targetOptions = fieldProps[formType].options ?
      type === 'InputCombo' ? convertOptionsInputToValue(fieldProps[formType].options) : () => 'loadOptions' : undefined;

    const validation = [];
    if (fieldProps[formType].required) validation.push(() => 'required method');
    if (fieldProps[formType].validationFunction &&
      _.isFunction(fieldProps[formType].validationFunction))
      validation.push(fieldProps[formType].validationFunction);

    expect(field.length).to.equal(1);
    expect(field.prop('name')).to.equal(fieldProps.property);
    expect(field.prop('type')).to.equal(typeMap[type].type);
    if (fieldProps[formType].required) expect(field.prop('label')).to.equal(label+requiredLabel);
    else expect(field.prop('label')).to.equal(label);
    expect(field.prop('component')).to.equal(typeMap[type].component);
    if (_.isFunction(targetOptions)) expect(field.prop('loadOptions')).a('function');
    else expect(field.prop('options')).to.deep.equal(targetOptions);
    if (validation.length > 0) {
      expect(field.prop('validate').length).to.deep.equal(validation.length);
      field.prop('validate').forEach(func => expect(func).a('function'));
    } else {
      expect(!field.prop('validate') || field.prop('validate').length === 0).to.be.true;
    }
  };

  const convertOptionsInputToValue = (options) =>
    _.map(options, option => ({ text: option.label, value: option.value }));

  it('should render text by default', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      edit: true
    };

    const component = renderComponent(userField, true);
    checkField(component, userField, 'Property1', 'InputText', true);
  });

  it('should render text when requested', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      edit: {
        type: 'text'
      }
    };

    const component = renderComponent(userField, true);
    checkField(component, userField, 'Property1', 'InputText', true);
  });

  it('should render combo when requested', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      create: {
        type: 'select',
        component: 'InputCombo',
        options: [{ value: 'a', label: 'a' }, { value: 'b', label: 'b' }]
      }
    };

    const component = renderComponent(userField, false);
    checkField(component, userField, 'Property1', 'InputCombo', false);
  });

  it('should render multi-combo when requested', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      create: {
        type: 'select',
        component: 'InputMultiCombo',
        options: [{ value: 'a', label: 'a' }, { value: 'b', label: 'b' }]
      }
    };

    const component = renderComponent(userField, false);
    checkField(component, userField, 'Property1', 'InputMultiCombo', false);
  });

  it('should render select-combo when requested', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      edit: {
        type: 'select',
        component: 'InputSelectCombo',
        options: [{ value: 'a', label: 'a' }, { value: 'b', label: 'b' }]
      }
    };

    const component = renderComponent(userField, true);
    checkField(component, userField, 'Property1', 'InputSelectCombo', true);
  });

  const testFieldValidation = (type, required) => {

    const dummyOptions = [{ value: 'a', label: 'a' }, { value: 'b', label: 'b' }];

    const userField = {
      property: 'object.property1',
      label: 'Property1',
      edit: {
        type: typeMap[type].type,
        required,
        component: type,
        validationFunction: () => true,
        options: typeMap[type].type === 'select' ? dummyOptions : undefined
      }
    };

    const component = renderComponent(userField, true);
    checkField(component, userField, 'Property1', type, true);
  };

  it('should render validation for text', () => {
    testFieldValidation('InputText');
  });

  it('should render validation for InputCombo', () => {
    testFieldValidation('InputCombo');
  });

  it('should render validation for InputMultiCombo', () => {
    testFieldValidation('InputMultiCombo');
  });

  it('should render validation for InputSelectCombo', () => {
    testFieldValidation('InputSelectCombo');
  });

  it('should render validation and required for text', () => {
    testFieldValidation('InputText', true);
  });

  it('should render validation and required for InputCombo', () => {
    testFieldValidation('InputCombo', true);
  });

  it('should render validation and required for InputMultiCombo', () => {
    testFieldValidation('InputMultiCombo', true);
  });

  it('should render validation and required for InputSelectCombo', () => {
    testFieldValidation('InputSelectCombo', true);
  });

  it('should render required for InputSelectCombo', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      edit: {
        type: 'select',
        required: true,
        component: 'InputSelectCombo',
        options: [{ value: 'a', label: 'a' }, { value: 'b', label: 'b' }]
      }
    };

    const component = renderComponent(userField, true);
    checkField(component, userField, 'Property1', 'InputSelectCombo', true);
  });

  it('should ignore validationFunction with bad type', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      edit: {
        type: 'select',
        required: true,
        component: 'InputSelectCombo',
        validationFunction: 'blah',
        options: [{ value: 'a', label: 'a' }, { value: 'b', label: 'b' }]
      }
    };

    const component = renderComponent(userField, true);
    checkField(component, userField, 'Property1', 'InputSelectCombo', true);
  });

  it('required function display required notation', () => {
    const property = 'object.property1';
    const userField = {
      property,
      label: 'Property1',
      edit: {
        type: 'text',
        required: true,
      }
    };

    const component = renderComponent(userField, true);
    checkField(component, userField, 'Property1', 'InputText', true);
  });

  it('required function should work with languageDictionary', () => {
    const languageDictionary = {
      requiredFieldLabel: 'RequiredLabel'
    };
    const property = 'object.property1';
    const userField = {
      property,
      label: 'Property1',
      edit: {
        type: 'text',
        required: true,
      }
    };

    const component = renderComponent(userField, true, languageDictionary);
    checkField(component, userField, 'Property1', 'InputText', true, 'RequiredLabel');
  });

});
