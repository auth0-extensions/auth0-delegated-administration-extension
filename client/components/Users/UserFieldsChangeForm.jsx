import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { reduxForm } from 'redux-form';

import UserCustomFormFields from './UserCustomFormFields';

class UserFieldsChangeForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    getDictValue: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    customFields: PropTypes.array,
    customFieldGetter: PropTypes.func.isRequired,
    languageDictionary: PropTypes.object
  };

  render() {
    const languageDictionary = this.props.languageDictionary || {};
    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            <UserCustomFormFields customFieldGetter={this.props.customFieldGetter}
                                  customFields={this.props.customFields}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="default" disabled={this.props.submitting} onClick={this.props.onClose}>
            {languageDictionary.cancelButtonText || 'Cancel'}
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={this.props.submitting} onClick={this.props.handleSubmit}>
            {languageDictionary.updateButtonText || 'Update'}
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
