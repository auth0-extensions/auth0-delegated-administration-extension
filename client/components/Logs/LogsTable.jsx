import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Error, LoadingPanel, Table, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';
import moment from 'moment';
import _ from 'lodash';
import getErrorMessage from '../../utils/getErrorMessage';

export default class LogsTable extends Component {
  static propTypes = {
    onOpen: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    logs: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.logs !== this.props.logs || nextProps.loading !== this.props.loading;
  }

  render() {
    const { error, loading, settings } = this.props;
    const languageDictionary = this.props.languageDictionary || {};
    const suppressRawData = settings && settings.suppressRawData === true;

    if (!error && this.props.logs.size === 0) {
      return <div>{languageDictionary.noLogsMessage || 'No logs found'}</div>;
    }

    const logs = this.props.logs.toJS();
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error, settings.errorTranslator)} />
        <Table>
          <TableHeader>
            <TableColumn width="3%" />
            <TableColumn width="20%">{languageDictionary.logEventColumnHeader || 'Event'}</TableColumn>
            <TableColumn width="25%">{languageDictionary.logDescriptionColumnHeader || 'Description'}</TableColumn>
            <TableColumn width="12%">{languageDictionary.logDateColumnHeader || 'Date'}</TableColumn>
            <TableColumn width="15%">{languageDictionary.logConnectionColumnHeader || 'Connection'}</TableColumn>
            <TableColumn width="15%">{languageDictionary.logApplicationColumnHeader || 'Application'}</TableColumn>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => {
              const icon = log.type.icon;
              const onClick = suppressRawData ? null : () => this.props.onOpen(log._id);
              const logType = _.get(languageDictionary, `logTypes.${log.shortType}.event`, log.type.event);
              const logDescription = _.get(languageDictionary, `logTypes.${log.shortType}.description`, log.type.event);
              log.time_ago = moment(log.date).locale(languageDictionary.momentLocale || 'en').fromNow();
              return (
                <TableRow key={index}>
                  <TableIconCell color={icon.color} icon={icon.name} />
                  <TableTextCell onClick={onClick}>{logType || languageDictionary.logDialogDefaultLogRecordText || 'Log Record'}</TableTextCell>
                  <TableTextCell>{log.user_name || log.description || logDescription || log.type.description}</TableTextCell>
                  <TableTextCell>{log.time_ago}</TableTextCell>
                  <TableTextCell>{log.connection || languageDictionary.notApplicableLabel || 'N/A'}</TableTextCell>
                  <TableTextCell>{log.client_name || languageDictionary.notApplicableLabel || 'N/A'}</TableTextCell>
                </TableRow>
              );
            })
            }
          </TableBody>
        </Table>
      </LoadingPanel>
    );
  }
};
