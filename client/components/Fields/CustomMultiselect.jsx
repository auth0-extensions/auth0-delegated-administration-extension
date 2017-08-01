import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

class CustomMultiselect extends Component {

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

  render() {
    const { input, placeholder, loadOptions, name, multi } = this.props;
    // NOTE: see https://github.com/erikras/redux-form/issues/82 for onBlur() react-select docs
    return (
      <Select.Async
        {...input}
        className="react-multiselect"
        name={name}
        loadOptions={loadOptions}
        optionRenderer={this.renderValue}
        valueRenderer={this.renderValue}
        onBlur={() => input.onBlur()}
        placeholder={placeholder}
        multi={multi}
      />
    );
  }
}

CustomMultiselect.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  input: PropTypes.object,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  multi: PropTypes.bool
};

export default CustomMultiselect;
