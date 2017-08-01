import React, { Component, PropTypes } from 'react';
import { Multiselect } from 'auth0-extension-ui';
import CustomMultiselect from './CustomMultiselect';

class LabeledMultiSelect extends Component {

  render() {
    const { input, label } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={input.name} className="control-label col-xs-3">
          {label}
        </label>
        <div className="col-xs-9">
          <CustomMultiselect {...this.props} />
        </div>
      </div>
    );
  }
}

LabeledMultiSelect.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
};

export default LabeledMultiSelect;