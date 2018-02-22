import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Error, LoadingPanel, Table, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';
import moment from 'moment';
import getErrorMessage from '../../utils/getErrorMessage';

export default class UserLogs extends Component {
  static propTypes = {
    onOpen: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    logs: PropTypes.object.isRequired,
    languageDictionary: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.logs !== this.props.logs || nextProps.loading !== this.props.loading;
  }

  render() {
    const { error, loading } = this.props;

    if (!error && this.props.logs.size === 0) {
      return <div>There are no logs available for this user.</div>;
    }

    const languageDictionary = this.props.languageDictionary || {};
    const logs = this.props.logs.toJS();
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error)} />
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
              const type = log.type;
              const icon = type.icon;
              log.time_ago = moment(log.date).locale(languageDictionary.momentLocale || 'en').fromNow();
              return (
                <TableRow key={index}>
                  <TableIconCell color={icon.color} icon={icon.name} />
                  <TableTextCell onClick={() => this.props.onOpen(log._id)}>{type.event}</TableTextCell>
                  <TableTextCell>{log.user_name || log.description || type.description}</TableTextCell>
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
}
