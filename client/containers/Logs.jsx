import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Error, LoadingPanel, TableTotals } from 'auth0-extension-ui';

import * as actions from '../actions/log';
import LogDialog from '../components/Logs/LogDialog';
import LogsTable from '../components/Logs/LogsTable';
import TabsHeader from '../components/TabsHeader';
import getErrorMessage from '../utils/getErrorMessage';

class LogsContainer extends Component {
  static propTypes = {
    clearLog: PropTypes.func.isRequired,
    fetchLog: PropTypes.func.isRequired,
    fetchLogs: PropTypes.func.isRequired,
    log: PropTypes.object,
    accessLevel: PropTypes.object,
    logs: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.fetchLogs();
  }

  refresh = () => {
    this.props.fetchLogs();
  };

  loadMore = () => {
    this.props.fetchLogs(this.props.logs.nextPage);
  };

  createToolbar(isBottom: false) {
    const languageDictionary = this.props.languageDictionary;
    if (isBottom && (!this.props.logs.records || this.props.logs.records.size <= 20)) {
      return <div></div>;
    }

    return (
      <ButtonToolbar className="pull-right">
        <Button bsSize="small" onClick={this.refresh} disabled={this.props.logs.loading}>
          <i className="icon icon-budicon-257"></i> {languageDictionary.logsRefreshButtonText || 'Refresh'}
        </Button>
        <Button bsStyle="primary" bsSize="small" disabled={this.props.logs.loading} onClick={this.loadMore}>
          <i className="icon icon-budicon-686"></i> {languageDictionary.logsLoadMoreButtonText || 'Load More'}
        </Button>
      </ButtonToolbar>
    );
  }

  render() {
    const { log, logs, accessLevel, languageDictionary } = this.props;
    return (
      <div>
        <TabsHeader role={accessLevel.role} languageDictionary={languageDictionary}/>
        <LogDialog
          onClose={this.props.clearLog}
          error={log.error}
          loading={log.loading}
          log={log.record}
          logId={log.id}
          languageDictionary={languageDictionary}
        />
        <div className="row">
          <div className="col-xs-12 wrapper">
            {this.createToolbar(false)}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, logs.error)} />

            <LoadingPanel show={logs.loading}>
              <LogsTable onOpen={this.props.fetchLog} loading={logs.loading} logs={logs.records} settings={this.props.settings} languageDictionary={languageDictionary} />
            </LoadingPanel>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <TableTotals currentCount={logs.records.size} totalCount={logs.total} />
            {this.createToolbar(true)}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logs: {
      error: state.logs.get('error'),
      loading: state.logs.get('loading'),
      records: state.logs.get('records'),
      total: state.logs.get('total'),
      nextPage: state.logs.get('nextPage')
    },
    log: {
      record: state.log.get('record'),
      id: state.log.get('logId'),
      error: state.log.get('error'),
      loading: state.log.get('loading')
    },
    settings: state.settings.get('record').toJS().settings,
    languageDictionary: state.languageDictionary.get('record').toJS()
  };
}

export default connect(mapStateToProps, actions)(LogsContainer);
