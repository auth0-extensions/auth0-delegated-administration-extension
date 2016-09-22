import React, { PropTypes, Component } from 'react';
import Select from 'react-select';
import '../../../node_modules/react-select/dist/react-select.css';

export default class MultiSelect extends Component {
  static propTypes = {
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(value) {
    if (value && value.length) {
      value = value.map(option => option.value);
    }

    if (!value) {
      return this.props.onChange(null);
    }

    // if value has a value key, must wrap value and overwrite onChange because of
    // https://github.com/erikras/redux-form/blob/master/src/events/getValue.js#L37-L39
    return value.value ? this.props.onChange({ value }) : this.props.onChange(value);
  }

  handleBlur() {
    // https://github.com/JedWatson/react-select/issues/489
    const { value } = this.props;
    if (!value) return this.props.onBlur(null);
    return value.value ? this.props.onBlur({ value }) : this.props.onBlur(value);
  }

  render() {
    const { value, onBlur, onChange, ...otherProps } = this.props
    return (
      <Select
        {...otherProps}
        // see https://github.com/JedWatson/react-select/issues/488
        value={value || ''}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}
