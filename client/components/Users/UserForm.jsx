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
    createMemberships: PropTypes.boolean,
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
      <div className="custom-field">
        <InputText field={usernameField} fieldName="username" label="Username" ref="username" />
      </div>
    );
  }

  renderMemberships(membershipsField, memberships, createMemberships) {
    const allMemberships = _(memberships || [])
      .concat(membershipsField.value)
      .uniq()
      .sort()
      .value();
    if (allMemberships.length <= 1 && !createMemberships) {
      return null;
    }

    return (
      <div className="custom-field">
        <div className="form-group">
          <label>{this.props.getDictValue('memberships', 'Memberships')}</label>
          <MultiSelect
            allowCreate={createMemberships}
            options={allMemberships.map(m => ({ value: m, label: m }))}
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
      <div className="custom-field">
        <InputCombo options={options} field={field} fieldName="connection" label="Connection" onChange={this.onConnectionChange} />
      </div>
    );
  }

  render() {
    const connections = this.props.connections;
    const { fields, memberships, createMemberships } = this.props;

    return (
      <form className="create-user form-horizontal" style={{ marginTop: '30px' }}>
        {this.renderMemberships(fields.memberships, memberships, createMemberships)}
        <div className="custom-field">
          <InputText field={fields.email} fieldName="email" label="Email" ref="email" />
        </div>
        {this.renderUsername(connections, fields.connection, fields.username)}
        <div className="custom-field">
          <InputText field={fields.password} fieldName="password" label="Password" type="password" ref="password" />
        </div>
        <div className="custom-field repeat-password">
          <InputText field={fields.repeatPassword} fieldName="repeat-password" label="Repeat Password" type="password" ref="repeatPassword" />
        </div>
        {this.renderConnections(fields.connection, connections)}
      </form>
    );
  }
});
