import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { reduxForm } from 'redux-form';

import UserCustomFormFields from './UserCustomFormFields';

import { RESERVED_USER_FIELDS } from '../../constants';

class UserFieldsChangeForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    getDictValue: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    customFields: PropTypes.array,
    languageDictionary: PropTypes.object,
    loading: PropTypes.bool
  };

  render() {
    const fields = this.props.customFields || [];

    if (fields.length === 0) return null;

    const languageDictionary = this.props.languageDictionary || {};

    const filteredCustomFields = _.filter(fields, field => !_.includes(RESERVED_USER_FIELDS, field.property) && field.edit);

    if (filteredCustomFields.length === 0) return null;

    const { loading } = this.props;

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            <UserCustomFormFields isEditForm={true}
                                  fields={filteredCustomFields}
                                  languageDictionary={languageDictionary}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="default" disabled={loading} onClick={this.props.onClose}>
            {languageDictionary.cancelButtonText || 'Cancel'}
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={loading} onClick={this.props.handleSubmit}>
            {loading ? languageDictionary.savingText || 'Saving....' : languageDictionary.updateButtonText || 'Update'}
          </Button>
        </Modal.Footer>
      </div>
    );
  }
}

const reduxFormDecorator = reduxForm({
  form: 'user'
});

export default reduxFormDecorator(UserFieldsChangeForm);
