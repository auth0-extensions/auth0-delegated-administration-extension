import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Error,
  LoadingPanel,
  Table,
  TableBody,
  TableIconCell,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from 'auth0-extension-ui';
import getErrorMessage from "../../utils/getErrorMessage";

export default class UserDevices extends Component {
  static propTypes = {
    user: PropTypes.object,
    error: PropTypes.string,
    devices: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    languageDictionary: PropTypes.object
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.devices !== this.props.devices || nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { error, loading } = this.props;
    if (loading) {
      return <div></div>;
    }

    const languageDictionary = this.props.languageDictionary || {};

    if (!error && this.props.devices.size === 0) {
      return <div>{languageDictionary.noDevicesMessage || 'This user does not have any registered devices.'}</div>;
    }

    const devices = this.props.devices.toJS();

    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary.errors, error)} />
        <Table>
          <TableHeader>
            <TableColumn width="3%"/>
            <TableColumn width="70%">{languageDictionary.deviceNameColumnHeader || 'Device'}</TableColumn>
            <TableColumn width="27%">
              {languageDictionary.deviceNumberTokensColumnHeader || '# of Tokens/Public Keys'}
            </TableColumn>
          </TableHeader>
          <TableBody>
            {Object.keys(devices).sort().map((device) =>
              <TableRow key={device}>
                <TableIconCell color="green" icon="243"/>
                <TableTextCell>{device}</TableTextCell>
                <TableTextCell>{devices[device]}</TableTextCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </LoadingPanel>
    );
  }
}
