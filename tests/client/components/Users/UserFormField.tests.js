import _ from 'lodash';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { render, act } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createStore, combineReducers } from 'redux';
import { reduxForm, reducer as formReducer } from 'redux-form';
import proxyquire from 'proxyquire';
import { InputText, InputCombo, Multiselect, Select } from '@a0/auth0-extension-ui';

import fakeStore from '../../../utils/fakeStore';

/* Record the props the redux-form Field receives so we can assert what UserFormField passes to it. */
let captured = [];
const StubField = (props) => {
  captured.push(props);
  return null;
};

const UserFormField = proxyquire(
  '../../../../client/components/Users/UserFormField',
  { 'redux-form': { Field: StubField } }
).default;

class TestForm extends Component {
  render() {
    return <UserFormField
      {...this.props}
    />
  }
};

const TestFormWrapper = reduxForm({ form: 'test' })(TestForm);

/*
 * Second proxyquire: real redux-form Field + stubbed inner components.
 * Used to test the MultiComboField / SelectComboField wrapper behaviour
 * (value normalisation and onBlur patching) by capturing what the wrappers
 * actually pass to the underlying library component.
 */
let capturedWrapperInput = null;
const StubMultiselect = ({ input, ...rest }) => { capturedWrapperInput = input; return null; };
const StubSelect = ({ input, ...rest }) => { capturedWrapperInput = input; return null; };

const UserFormFieldWithInnerStubs = proxyquire(
  '../../../../client/components/Users/UserFormField',
  {
    '@a0/auth0-extension-ui': {
      InputText: () => null,
      InputCombo: () => null,
      Multiselect: StubMultiselect,
      Select: StubSelect,
      VirtualizedSelect: () => null,
    }
  }
).default;

const makeRealStore = (initialValues = {}) =>
  createStore(
    combineReducers({ form: formReducer }),
    { form: { test: { values: initialValues } } }
  );

class TestFormInner extends Component {
  render() { return <UserFormFieldWithInnerStubs {...this.props} />; }
}

const renderWithRealStore = (field, isEditField, initialValues = {}) => {
  const store = makeRealStore(initialValues);
  const WrappedForm = reduxForm({ form: 'test' })(TestFormInner);
  render(
    <Provider store={store}>
      <WrappedForm field={field} isEditField={isEditField} />
    </Provider>
  );
  return store;
};

describe('#Client-Components-Users-UserFormField', () => {
  const renderComponent = (field, isEditField, languageDictionary) => {
    const initialState = {
      form: {
        test: {
        }
      }
    };
    return render(
      <Provider store={fakeStore(initialState)}>
        <TestFormWrapper
          field={field}
          isEditField={isEditField}
          languageDictionary={languageDictionary}
        />
      </Provider>);
  };

  beforeEach(() => {
    captured = [];
    capturedWrapperInput = null;
    document.body.innerHTML = '';
  });

  const typeMap = {
    'InputText': { type: 'text', component: InputText },
    'InputCombo': { type: 'select', component: InputCombo },
    // These use wrapper components (MultiComboField / SelectComboField) — not the library
    // components directly. The wrapper reference is checked separately below.
    'InputMultiCombo': { type: 'select', component: null },
    'InputSelectCombo': { type: 'select', component: null }
  };

  const checkField = (fieldProps, label, type, isEdit, requiredLabel) => {
    requiredLabel = requiredLabel || ' (required)';

    const formType = isEdit ? 'edit' : 'create';

    const targetOptions = fieldProps[formType].options ?
      type === 'InputCombo' ? convertOptionsInputToValue(fieldProps[formType].options) : () => 'loadOptions' : undefined;

    const validation = [];
    if (fieldProps[formType].required) validation.push(() => 'required method');
    if (fieldProps[formType].validationFunction &&
      _.isFunction(fieldProps[formType].validationFunction))
      validation.push(fieldProps[formType].validationFunction);

    expect(captured.length).to.equal(1);
    const field = captured[0];
    expect(field.name).to.equal(fieldProps.property);
    expect(field.type).to.equal(typeMap[type].type);
    if (fieldProps[formType].required) expect(field.label).to.equal(label + requiredLabel);
    else expect(field.label).to.equal(label);
    if (typeMap[type].component !== null) {
      expect(field.component).to.equal(typeMap[type].component);
    } else {
      // Wrapper components: verify it is a function but NOT the raw library component.
      expect(field.component).to.be.a('function');
      expect(field.component).to.not.equal(Multiselect);
      expect(field.component).to.not.equal(Select);
    }
    if (_.isFunction(targetOptions)) expect(field.loadOptions).a('function');
    else expect(field.options).to.deep.equal(targetOptions);
    if (validation.length > 0) {
      expect(field.validate.length).to.deep.equal(validation.length);
      field.validate.forEach(func => expect(func).a('function'));
    } else {
      expect(!field.validate || field.validate.length === 0).to.be.true;
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

    const queries = renderComponent(userField, true);
    checkField(userField, 'Property1', 'InputText', true);
  });

  it('should render text when requested', () => {
    const userField = {
      property: 'object.property1',
      label: 'Property1',
      edit: {
        type: 'text'
      }
    };

    const queries = renderComponent(userField, true);
    checkField(userField, 'Property1', 'InputText', true);
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

    const queries = renderComponent(userField, false);
    checkField(userField, 'Property1', 'InputCombo', false);
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

    const queries = renderComponent(userField, false);
    checkField(userField, 'Property1', 'InputMultiCombo', false);
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

    const queries = renderComponent(userField, true);
    checkField(userField, 'Property1', 'InputSelectCombo', true);
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

    const queries = renderComponent(userField, true);
    checkField(userField, 'Property1', type, true);
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

    const queries = renderComponent(userField, true);
    checkField(userField, 'Property1', 'InputSelectCombo', true);
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

    const queries = renderComponent(userField, true);
    checkField(userField, 'Property1', 'InputSelectCombo', true);
  });

  // ─── loadOptions callback contract ───────────────────────────────────────────

  ['InputMultiCombo', 'InputSelectCombo'].forEach(componentName => {
    describe(`${componentName} loadOptions`, () => {
      const makeField = (options) => ({
        property: 'allowed',
        label: 'Allowed',
        edit: { type: 'select', component: componentName, options }
      });

      it('calls callback with a plain array (not null + options object)', () => {
        renderComponent(makeField([{ value: 'a', label: 'A' }]), true);
        const loadOptions = captured[0].loadOptions;

        let firstArg;
        loadOptions('', (...args) => { firstArg = args[0]; });

        expect(Array.isArray(firstArg)).to.be.true;
      });

      it('normalizes plain string options to {value, label} objects', () => {
        renderComponent(makeField(['AppOne', 'AppTwo']), true);
        const loadOptions = captured[0].loadOptions;

        let receivedOptions;
        loadOptions('', (opts) => { receivedOptions = opts; });

        expect(receivedOptions).to.deep.equal([
          { value: 'AppOne', label: 'AppOne' },
          { value: 'AppTwo', label: 'AppTwo' }
        ]);
      });

      it('passes through {value, label} options unchanged', () => {
        const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
        renderComponent(makeField(options), true);
        const loadOptions = captured[0].loadOptions;

        let receivedOptions;
        loadOptions('', (opts) => { receivedOptions = opts; });

        expect(receivedOptions).to.deep.equal(options);
      });
    });
  });

  // ─── wrapper behaviour (value normalisation + onBlur patching) ───────────────

  describe('InputMultiCombo wrapper', () => {
    const multiField = {
      property: 'allowed',
      label: 'Allowed',
      edit: { type: 'select', component: 'InputMultiCombo', options: ['AppOne', 'AppTwo', 'AppThree'] }
    };

    it('normalizes stored plain string values to {value, label} for display', () => {
      renderWithRealStore(multiField, true, { allowed: ['AppOne', 'AppTwo'] });

      expect(capturedWrapperInput.value).to.deep.equal([
        { value: 'AppOne', label: 'AppOne' },
        { value: 'AppTwo', label: 'AppTwo' }
      ]);
    });

    it('passes through already-shaped {value, label} values unchanged', () => {
      const stored = [{ value: 'AppOne', label: 'AppOne' }];
      renderWithRealStore(multiField, true, { allowed: stored });

      expect(capturedWrapperInput.value).to.deep.equal(stored);
    });

    it('treats missing/empty stored value as empty array', () => {
      renderWithRealStore(multiField, true, {});

      expect(capturedWrapperInput.value).to.deep.equal([]);
    });

    it('onBlur passes current value to redux-form — field is not reset to []', () => {
      const store = renderWithRealStore(multiField, true, { allowed: ['AppOne', 'AppTwo'] });

      // Simulate the inner component calling onBlur() with no argument — the exact
      // pattern that previously reset the field to [] via parse(undefined) = [].
      act(() => { capturedWrapperInput.onBlur(); });

      const values = store.getState().form.test.values;
      expect(values.allowed).to.deep.equal(['AppOne', 'AppTwo']);
    });
  });

  describe('InputSelectCombo wrapper', () => {
    const singleField = {
      property: 'tier',
      label: 'Tier',
      edit: { type: 'select', component: 'InputSelectCombo', options: ['free', 'pro'] }
    };

    it('normalizes a stored plain string value to a {value, label} object for display', () => {
      renderWithRealStore(singleField, true, { tier: 'pro' });

      expect(capturedWrapperInput.value).to.deep.equal({ value: 'pro', label: 'pro' });
    });

    it('passes through an already-shaped {value, label} value unchanged', () => {
      const stored = { value: 'pro', label: 'pro' };
      renderWithRealStore(singleField, true, { tier: stored });

      expect(capturedWrapperInput.value).to.deep.equal(stored);
    });

    it('maps null/undefined stored value to null', () => {
      renderWithRealStore(singleField, true, {});

      expect(capturedWrapperInput.value).to.equal(null);
    });

    it('onBlur passes current value to redux-form — field is not reset', () => {
      const store = renderWithRealStore(singleField, true, { tier: 'pro' });

      act(() => { capturedWrapperInput.onBlur(); });

      const values = store.getState().form.test.values;
      expect(values.tier).to.equal('pro');
    });
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

    const queries = renderComponent(userField, true);
    checkField(userField, 'Property1', 'InputText', true);
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

    const queries = renderComponent(userField, true, languageDictionary);
    checkField(userField, 'Property1', 'InputText', true, 'RequiredLabel');
  });

});
