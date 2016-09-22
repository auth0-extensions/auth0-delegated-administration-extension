import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

import createForm from '../../utils/createForm';
import { InputText, InputCombo, MultiSelect } from '../../components/Dashboard';

export default createForm('user', class extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    initialValues: PropTypes.object,
    connections: PropTypes.array.isRequired,
    memberships: PropTypes.array.isRequired,
    getDictValue: React.PropTypes.func
  }

  static formFields = [
    'email',
    'username',
    'password',
    'repeatPassword',
    'connection',
    'memberships'
  ];

  renderUsername(connections, connectionField, usernameField) {
    const selectedConnection = _.find(connections, (conn) => conn.name === connectionField.value);
    const requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
    if (!requireUsername) {
      return null;
    }

    return (
      <div className="custom_field">
        <InputText field={usernameField} fieldName="username" label="Username" ref="username" />
      </div>
    );
  }

  renderMemberships(membershipsField, memberships, connections) {
    if (!memberships || memberships.length <= 1) {
      return null;
    }
    const noConnections = (!connections || connections.length <= 1);
    return (
      <div className={noConnections ? 'custom_field noConnections' : 'custom_field'}>
        <div className="form-group">
          <label>{this.props.getDictValue('memberships', 'Memberships')}</label>
          <MultiSelect
            options={memberships.map(m => ({ value: m, label: m }))}
            multi
            {...membershipsField}
          />
        </div>
      </div>
    );
  }

  renderConnections(field, connections) {
    if (!connections || connections.length <= 1) {
      return null;
    }

    const options = connections.map(conn => ({ value: conn.name, text: conn.name }));

    return (
      <div className="custom_field">
        <InputCombo options={options} field={field} fieldName="connection" label="Connection" onChange={this.onConnectionChange} />
      </div>
    );
  }

  render() {
    const connections = this.props.connections;
    const { fields, memberships } = this.props;

    return (
      <form className="createUserScreenForm form-horizontal" style={{ marginTop: '30px' }}>
        <div className="custom_field">
          <InputText field={fields.email} fieldName="email" label="Email" ref="email" />
        </div>
        {this.renderUsername(connections, fields.connection, fields.username)}
        <div className="custom_field">
          <InputText field={fields.password} fieldName="password" label="Password" type="password" ref="password" />
        </div>
        <div className="custom_field repeat_password">
          <InputText field={fields.repeatPassword} fieldName="repeat_password" label="Repeat Password" type="password" ref="repeatPassword" />
        </div>
        {this.renderMemberships(fields.memberships, memberships, connections)}
        {this.renderConnections(fields.connection, connections)}
      </form>
    );
  }
});
