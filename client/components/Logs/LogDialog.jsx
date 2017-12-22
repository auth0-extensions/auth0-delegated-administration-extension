import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { Error, Json, LoadingPanel } from 'auth0-extension-ui';

export default class LogDialog extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    log: PropTypes.object.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    logId: PropTypes.string,
    languageDictionary: PropTypes.object
  }

  render() {
    const { logId, error, loading, onClose } = this.props;
    if (logId === null) {
      return <div></div>;
    }

    const languageDictionary = this.props.languageDictionary || {};

    const log = this.props.log.toJS();

    const logType = _.get(languageDictionary, `logTypes.${log.shortType}.event`, log.type);

    return (
      <Modal show={logId !== null} onHide={onClose}>
        <Modal.Header closeButton={!loading}>
          <Modal.Title>{languageDictionary.logDialogTitleText || 'Log'} - <span>{logType || languageDictionary.logDialogDefaultLogRecordText || 'Log Record'}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoadingPanel
            show={loading} spinnerStyle={{ height: '16px', width: '16px' }}
            animationStyle={{ paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '10px' }}
          >
            <Error message={error}>
              <Json jsonObject={log} />
            </Error>
          </LoadingPanel>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} onClick={onClose}>
            <i className="icon icon-budicon-501"></i> {languageDictionary.closeButtonLabel || 'Close'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
