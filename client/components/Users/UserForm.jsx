import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import UserCustomFormFields from './UserCustomFormFields';
import * as useDefaultFields from '../../utils/useDefaultFields';

class AddUserForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    connections: PropTypes.array.isRequired,
    memberships: PropTypes.array.isRequired,
    createMemberships: PropTypes.bool,
    getDictValue: PropTypes.func,
    hasSelectedConnection: PropTypes.string,
    hasMembership: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    customFields: PropTypes.array,
    customFieldGetter: PropTypes.func.isRequired,
    languageDictionary: PropTypes.object,
    loading: PropTypes.bool,
  };


  render() {

    const {
      submitting,
      customFields,
      connections,
      hasSelectedConnection,
      initialValues,
      hasMembership,
      memberships,
      createMemberships,
      getDictValue,
      loading,
    } = this.props;
     
    const languageDictionary = this.props.languageDictionary || {};

    /* First let's add field to the top if not in the list of fields */
    const fields = _.cloneDeep(customFields) || [];
    useDefaultFields.useConnectionsField(false, fields, connections, this.onConnectionsChange);
    useDefaultFields.usePasswordFields(false, fields);
    useDefaultFields.useUsernameField(false, fields, connections, hasSelectedConnection, initialValues);
    useDefaultFields.useEmailField(false, fields);
    useDefaultFields.useMembershipsField(false, fields, hasMembership, memberships, createMemberships, getDictValue);

    const createFields = _.filter(fields, field => field.create);

    return (
      <div>
        <Modal.Body>
          {this.props.children}
          <div className="form-horizontal">
            <UserCustomFormFields isEditForm={false} fields={createFields} languageDictionary={languageDictionary}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="large" bsStyle="default" disabled={loading} onClick={this.props.onClose}>
            {languageDictionary.cancelButtonText || 'Cancel'}
          </Button>
          <Button bsSize="large" bsStyle="primary" disabled={loading} onClick={this.props.handleSubmit}>
           {loading ? languageDictionary.savingText || 'Saving....' : languageDictionary.createButtonText || 'Create'}
          </Button>
        </Modal.Footer>
      </div>
    );
  }
}

const reduxFormDecorator = reduxForm({
  form: 'user'
});

// Decorate with connect to read form values
const selector = formValueSelector('user');
const connectDecorator = connect(state => {
  const hasSelectedConnection = selector(state, 'connection');
  const hasMembership = selector(state, 'memberships');

  return {
    hasSelectedConnection,
    hasMembership
  };
});

export default connectDecorator(reduxFormDecorator(AddUserForm));
