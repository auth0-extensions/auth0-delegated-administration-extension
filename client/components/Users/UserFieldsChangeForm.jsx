import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { reduxForm } from 'redux-form';

import UserCustomFormFields from './UserCustomFormFields';

class UserFieldsChangeForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    getDictValue: React.PropTypes.func,
    onClose: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    submitting: React.PropTypes.boolean,
    customFields: React.PropTypes.string,
    customFieldGetter: React.PropTypes.func.isRequired,
    method: React.PropTypes.string.isRequired
  }

  render() {

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            <UserCustomFormFields customFieldGetter={this.props.customFieldGetter} customFields={this.props.customFields}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="transparent" disabled={this.props.submitting} onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={this.props.submitting} onClick={this.props.handleSubmit}>
            {this.props.method}
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
