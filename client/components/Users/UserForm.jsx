import React, {PropTypes, Component} from 'react';
import {Error, Json, LoadingPanel, InputCombo, InputText, Confirm} from '../Dashboard';
import _ from 'lodash';

export default class UserForm extends Component {
    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        connections: React.PropTypes.array.isRequired,
        createUser: React.PropTypes.func.isRequired,
        userWasSaved: React.PropTypes.func.isRequired,
        fetchUsers: React.PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            usernameRequired: false
        }
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

    render() {
        if (this.props.loading || this.props.error) {
            return <div></div>;
        }
        const connections = _.filter(this.props.connections, function (connection) {
            return connection.strategy == 'auth0';
        });
        const usernameRequired = this.state.usernameRequired;
        return <div className="row">
            <form className="createUserScreenForm form-horizontal col-xs-12" style={{marginTop: '40px'}}
                  onSubmit={function (e) {
                      e.preventDefault();
                      let arr = $('.createUserScreenForm').serializeArray(), obj = {};
                      $.each(arr, function (indx, el) {
                          if (el.name != 'repeat_password') {
                              obj[el.name] = el.value;
                          }
                      });
                      obj["email_verified"] = false;
                      this.props.createUser(obj, function () {
                          this.props.userWasSaved();
                          setTimeout(function () {
                              this.props.fetchUsers('', true);
                          }.bind(this), 500);
                      }.bind(this));
                  }.bind(this)}>
                <div className="form-group">
                    <label className="col-xs-2 control-label">Email</label>
                    <div className="col-xs-9">
                        <input type="email" name="email" className="form-control" required/>
                    </div>
                </div>
                {usernameRequired ?
                    <div className="form-group">
                        <label className="col-xs-2 control-label">Username</label>
                        <div className="col-xs-9">
                            <input type="text" name="username" className="form-control" required/>
                        </div>
                    </div>
                    : ''}
                <div className="form-group">
                    <label className="col-xs-2 control-label">Password</label>
                    <div className="col-xs-9">
                        <input type="password" name="password" className="form-control userCreatePassword" required
                               onChange={ this.validatePassword }/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-xs-2 control-label">Repeat Password</label>
                    <div className="col-xs-9">
                        <input type="password" name="repeat_password" className="form-control userCreatePasswordRepeat"
                               required onChange={ this.validatePassword }/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-xs-2 control-label">Connection</label>
                    <div className="col-xs-9">
                        <select className="form-control" name="connection"
                                onChange={this.onConnectionChange.bind(this)}>
                            <option value="">Select...</option>
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
    }
}
