import React, { PropTypes, Component } from 'react';
import { InputText } from '../Dashboard';
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
    fetchUsers: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      usernameRequired: false,
      departments: false
    };
  }

  validatePassword = ()=> {
    let password = document.getElementsByClassName("userCreatePassword")[0]
      , confirm_password = document.getElementsByClassName("userCreatePasswordRepeat")[0];
    if (password.value != confirm_password.value) {
      confirm_password.setCustomValidity("Passwords Don't Match");
    } else {
      confirm_password.setCustomValidity('');
    }
  }

  onConnectionChange = (e) => {
    let connection = _.find(this.props.connections, function (connection) {
      return connection.name == e.target.value;
    });
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
    let department = [];
    values.map((val) => {
      department.push(val.value);
    });
    this.setState({
      departments: department
    });
  };

  getOptions = (memberships) => {
    let options = [];
    _.each(memberships, (a, idx) => {
      options[idx] = { value: a, label: a };
    });
    if (options.length == 1 && !this.state.departments) {
      this.setState({
        departments: options[0].value
    });
    }
    return options;
  };

  render() {

    if (this.props.loading || this.props.error) {
      return <div></div>;
    }
    const connections = _.filter(this.props.connections, function (connection) {
      return connection.strategy == 'auth0';
    });
    const usernameRequired = this.state.usernameRequired;
    const { fields: { email, username, password, repeat_password, connection }, validationErrors, memberships } = this.props;
    const options = this.getOptions(memberships);
    return (
    <div className="row">
      <form className="createUserScreenForm form-horizontal col-xs-12" style={{ marginTop: '30px' }}
            onSubmit={function (e) {
              e.preventDefault();
              let arr = $('.createUserScreenForm').serializeArray(), obj = {};
              $.each(arr, function (indx, el) {
                if (el.name != 'repeat_password') {
                  if (
                    el.name == 'email' ||
                    el.name == 'username' ||
                    el.name == 'password' ||
                    el.name == 'connection'
                  ) {
                    obj[el.name] = el.value;
                  }
                }
              });
              if (this.state.departments) {
                obj['app_metadata'] = { "delegated-admin": { "department": this.state.departments } };
              }
              obj["email_verified"] = false;
              this.props.createUser(obj, function () {
                this.props.userWasSaved();
                setTimeout(function () {
                  this.props.fetchUsers('', true);
                }.bind(this), 500);
              }.bind(this));
            }.bind(this)}>
        <div className="custom_field">
          <InputText field={ email } fieldName="email" label="Email"
                     validationErrors={validationErrors}
          />
        </div>
        {usernameRequired ?
          <div className="custom_field">
            <InputText field={ username } fieldName="username" label="username"
                       validationErrors={validationErrors}
            />
          </div>
          : ''}
        <div className="custom_field">
          <InputText field={ password } fieldName="password" label="Password"
                     validationErrors={validationErrors}
          />
        </div>
        <div className="custom_field repeat_password">
          <InputText field={ repeat_password } fieldName="email" label="Repeat Password"
                     validationErrors={validationErrors}
          />
        </div>
        {(options.length > 1) ?
          <div className="custom_field">
            <div className="form-group">
              <label>Departments</label>
              <Select
                name="form-field-name"
                value={this.state.departments}
                options={options}
                onChange={this.logChange.bind(this)}
                multi={true}
              />
            </div>
          </div>
        :''}
        <div className="custom_field">
          <div className="form-group">
            <label>Connection</label>
            <select className="form-control" name="connection"
                    onChange={this.onConnectionChange.bind(this)}>
              {connections.map((connection, index) => {
                return <option key={index}
                               value={connection.name}>{connection.name}</option>;
              })}
            </select>
          </div>
        </div>
        <input type="submit" className="createUserButton"></input>
      </form>
    </div>
    )
  }
});
