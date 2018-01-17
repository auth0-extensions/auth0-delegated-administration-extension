import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Error } from 'auth0-extension-ui';
import { Modal } from 'react-bootstrap';

import { userActions, scriptActions } from '../../../actions';
import { UserFieldsChangeForm } from '../../../components/Users';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    fieldsChange: state.fieldsChange,
    userId: state.fieldsChange.toJS().userId,
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions,
    ...scriptActions
  };

  static propTypes = {
    fieldsChange: PropTypes.object.isRequired,
    changeFields: PropTypes.func.isRequired,
    cancelChangeFields: PropTypes.func.isRequired,
    userFields: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    languageDictionary: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.fieldsChange !== this.props.fieldsChange ||
      nextProps.userFields !== this.props.userFields ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onSubmit = (user) => {
    const submitFields = _([])
      .concat(_.map(_.filter(this.props.userFields, field => field.property && field.edit && field.edit !== false),
        field => field.property.split('.')[0]))
      .uniq()
      .value();

    this.props.changeFields(this.props.userId, _.pick(user, submitFields));
  }

  render() {
    const { error, loading, record } = this.props.fieldsChange.toJS();

    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    return (
      <Modal show={record !== null} className="modal-overflow-visible" onHide={this.props.cancelChangeFields}>
        <Modal.Header closeButton={loading} className="has-border">
          <Modal.Title>{languageDictionary.changeProfileDialogTitle || 'Change Profile'}</Modal.Title>
        </Modal.Header>

        <UserFieldsChangeForm
          customFields={this.props.userFields || []}
          customFieldGetter={field => field.edit}
          initialValues={record}
          onClose={this.props.cancelChangeFields}
          onSubmit={this.onSubmit}
          submitting={loading}
          languageDictionary={languageDictionary}
        >
          <Error message={error} />
        </UserFieldsChangeForm>
      </Modal>
    );
  }
});
