import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import '../../../node_modules/react-select/dist/react-select.css';
import './Multiselect.css';

class Multiselect extends Component {

  renderErrors(validationErrors, meta, name) {
    if (validationErrors && validationErrors[name] && validationErrors[name].length) {
      return (<div className="help-block">{validationErrors[name][0]}</div>);
    } else if (meta && meta.touched && meta.error) {
      return (<span className="help-block">{meta.error}</span>);
    }

    return null;
  }

  renderValue(value) {
    if (value.label === value.value) {
      return (
        <span>
          <strong>{value.label}</strong>
        </span>
      );
    }

    return (
      <span>
        <strong>{value.label}</strong>
        <span> ({value.value})</span>
      </span>
    );
  }

  renderOption(value) {
    if (this.props.displayLabelOnly) {
      return (
        <span>
          <strong>{value.label}</strong>
        </span>
      );
    }

    return this.renderValue(value)
  }

  renderElement(input, placeholder, loadOptions, name, validationErrors, meta, multi = true) {
    // NOTE: see https://github.com/erikras/redux-form/issues/82 for onBlur() react-select docs
    return (
      <div>
        <Select.Async
          {...input}
          className="react-multiselect"
          name={name}
          loadOptions={loadOptions}
          optionRenderer={this.renderOption.bind(this)}
          valueRenderer={this.renderValue}
          onBlur={() => input.onBlur()}
          placeholder={placeholder}
          multi={multi}
        />
        {this.renderErrors(validationErrors, meta, name)}
      </div>
    );
  }

  render() {
    const { input, placeholder, loadOptions, multi, label, validationErrors, meta, meta: { touched, error } } = this.props;
    const name = input.name || 'react-multiselect';
    const classes = classNames({
      'form-group': true,
      'has-error': (validationErrors && validationErrors[name] && validationErrors[name].length) || (touched && error)
    });

    if (!label) {
      return this.renderElement(input, placeholder, loadOptions, name, validationErrors, meta, multi);
    }

    return (
      <div className={classes}>
        <label htmlFor={name} className="react-multiselect-label control-label col-xs-3">
          {label}
        </label>
        <div className="col-xs-9">
          {this.renderElement(input, placeholder, loadOptions, name, validationErrors, meta, multi)}
        </div>
      </div>
    );
  }
}

Multiselect.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  displayLabelOnly: PropTypes.boolean,
  onBlur: PropTypes.func,
  input: PropTypes.object,
  placeholder: PropTypes.string,
  multi: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  validationErrors: PropTypes.object,
  meta: PropTypes.object
};

export default Multiselect;
