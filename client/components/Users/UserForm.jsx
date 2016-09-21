import React, { PropTypes, Component } from 'react';
import { InputText, Confirm, Error } from '../../components/Dashboard';
import createForm from '../../utils/createForm';
import _ from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default createForm('user', class extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    connections: React.PropTypes.array.isRequired,
    memberships: React.PropTypes.array.isRequired,
    createUser: React.PropTypes.func.isRequired,
    userWasSaved: React.PropTypes.func.isRequired,
    fetchUsers: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    closeConfirmation: React.PropTypes.func.isRequired,
    confirmLoading: PropTypes.bool.isRequired,
    hideConfirmWindow: PropTypes.func.isRequired,
    userCreateError: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      usernameRequired: false,
      memberships: false,
      customErrors: { }
    };
  }

  onConfirmUserCreate = () => {
    let obj = {};
    if (this.refs.email && this.refs.email.props.field.value)
      obj.email = this.refs.email.props.field.value;

    if (this.refs.username && this.refs.username.props.field.value)
      obj.username = this.refs.username.props.field.value;

    if (this.refs.password && this.refs.password.props.field.value) {
      if (this.refs.password.props.field.value !== this.refs.repeat_password.props.field.value) {
        this.setState({
          customErrors: {
            repeat_password: [ 'Repeat Password must be equal to password' ]
          }
        });
      } else {
        this.setState({
          customErrors: {}
        });
        obj.password = this.refs.password.props.field.value;
      }
    }

    if (this.refs.connection && this.refs.connection.value) {
      obj.connection = this.refs.connection.value;
    } else {
      obj.connection = (this.props.connections && this.props.connections[0]) ? this.props.connections[0].name : '';
    }

    if (this.state.memberships) {
      obj.memberships = this.state.memberships;
    }
    obj["email_verified"] = false;
    if (!this.state.customErrors.repeat_password)
      this.props.createUser(obj, function () {
        this.props.userWasSaved();
        setTimeout(function () {
          this.props.fetchUsers('', true);
        }.bind(this), 500);
      }.bind(this));
  };

  onConnectionChange = (e) => {
    const connection = _.find(this.props.connections, (conn) => conn.name === e.target.value);
    if (connection && connection.options && connection.options.requires_username) {
      this.setState({
        usernameRequired: true
      });
    } else {
      this.setState({
        usernameRequired: false
      });
    }
  }

  static formFields = [
    'email',
    'username',
    'password',
    'repeat_password',
    'connection'
  ];

  logChange = (values) => {
    const membership = [];
    values.map((val) => membership.push(val.value));
    this.setState({
      memberships: membership
    });
  };

  getOptions = (memberships) => {
    const options = [];
    _.each(memberships, (a, idx) => {
      options[idx] = { value: a, label: a };
    });
    if (options.length === 1 && !this.state.memberships) {
      /* THis runs on render, not allowed
      this.setState({
        memberships: options[0].value
    });
    */
    }
    return options;
  };

  render() {
    if (this.props.loading || this.props.error) {
      return <div></div>;
    }

    const connections = _.filter(this.props.connections, (connection) => connection.strategy === 'auth0');

    const usernameRequired = this.state.usernameRequired;
    const { fields: { email, username, password, repeat_password, connection },
            validationErrors, memberships, title, show,
            confirmLoading, userCreateError } = this.props;
    const options = this.getOptions(memberships);

    let isUsernameRequired = false;

    if (connections && connections.length === 1) {
      const connection = connections[0];
      if (connection && connection.options && connection.options.requires_username) {
        isUsernameRequired = true;
      }
    }

    return (
      <Confirm title={title} show={show} loading={confirmLoading} onCancel={this.props.hideConfirmWindow} onConfirm={this.onConfirmUserCreate}>
        <Error message={userCreateError} />
        <div className="row">
          <form className="createUserScreenForm form-horizontal col-xs-12" style={{ marginTop: '30px' }}>
            <div className="custom_field">
              <InputText field={email} fieldName="email" label="Email" validationErrors={validationErrors} ref="email" />
            </div>
            {usernameRequired || isUsernameRequired ?
              <div className="custom_field">
                <InputText field={username} fieldName="username" label="Username" validationErrors={validationErrors} ref="username" />
              </div>
              : ''}
            <div className="custom_field">
              <InputText field={password} fieldName="password" label="Password" type="password" validationErrors={validationErrors} ref="password" />
            </div>
            <div className="custom_field repeat_password">
              <InputText field={repeat_password} fieldName="repeat_password" label="Repeat Password" type="password" validationErrors={this.state.customErrors} ref="repeat_password" />
            </div>
            {(options.length > 1) ?
              <div className="custom_field">
                <div className="form-group">
                  <label>Memberships</label>
                  <Select
                    name="form-field-name"
                    value={this.state.memberships}
                    options={options}
                    onChange={this.logChange}
                    multi
                  />
                </div>
              </div>
            : ''}
            {(connections.length > 1) ?
              <div className="custom_field">
                <div className="form-group">
                  <label>Connection</label>
                  <select
                    className="form-control"
                    name="connection"
                    onChange={this.onConnectionChange}
                    ref="connection"
                  >
                    {connections.map((c, index) => <option key={index} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            : ''}
          </form>
        </div>
      </Confirm>
    );
  }
});
