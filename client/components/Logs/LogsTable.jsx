import React, { PropTypes, Component } from 'react';
import { Table, TableIconCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';

export default class LogsTable extends Component {
  static propTypes = {
    onOpen: PropTypes.func.isRequired,
    logs: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.logs !== this.props.logs;
  }

  render() {
    const logs = this.props.logs.toJS();
    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="15%">Event</TableColumn>
          <TableColumn width="25%">Description</TableColumn>
          <TableColumn width="12%">Date</TableColumn>
          <TableColumn width="15%">Connection</TableColumn>
          <TableColumn width="20%">Application</TableColumn>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => {
            const type = log.type;
            const icon = type.icon;

            return (
              <TableRow key={index}>
                <TableIconCell color={icon.color} icon={icon.name} />
                <TableTextCell onClick={this.props.onOpen} clickArgs={[ log._id ]}>{type.event}</TableTextCell>
                <TableTextCell>{log.user_name || log.description || type.description}</TableTextCell>
                <TableTextCell>{log.time_ago}</TableTextCell>
                <TableTextCell>{log.connection || 'N/A'}</TableTextCell>
                <TableTextCell>{log.client_name || 'N/A'}</TableTextCell>
              </TableRow>
            );
          })
        }
        </TableBody>
      </Table>
    );
  }
}
