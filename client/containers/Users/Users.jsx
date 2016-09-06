import React, {Component} from 'react';
import {connect} from 'react-redux';

import {connectionActions, userActions} from '../../actions';

import {UserOverview, UserForm} from '../../components/Users';
import {Confirm, Error} from '../../components/Dashboard';

import './Users.css';

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreateForm: false
        };
    }

    componentWillMount = () => {
        this.props.fetchUsers();
        this.props.fetchConnections();
    }

    onSearch = (query) => {
        this.props.fetchUsers(query);
    }

    onReset = () => {
        this.props.fetchUsers('', true);
    }

    openCreateForm = (e) => {
        e.preventDefault();
        this.setState({ showCreateForm: true });
    }

    onCancelUserCreate = () => {
        this.setState({ showCreateForm: false });
        this.props.fetchUsers('', true);
    }

    onConfirmUserCreate = () => {
        $('.createUserButton').click();
    }

    userWasSaved = () => {
        this.setState({ showCreateForm: false });
    }

    render() {
        const {loading, error, users, total, connections, userCreateError, userCreateLoading} = this.props;
        return (
            <div className="users">
                <div className="row content-header">
                    <div className="col-xs-12 userTableContent">
                        <h2>Users</h2>
                        <a id="addUser" className="btn btn-success pull-right new" href="#"
                           onClick={ this.openCreateForm.bind(this) }>
                            <i className="icon-budicon-473"></i>
                            Create User
                        </a>
                    </div>
                </div>
                <Confirm title="Create User" show={this.state.showCreateForm} loading={ userCreateLoading }
                         onCancel={ this.onCancelUserCreate.bind(this) }
                         onConfirm={this.onConfirmUserCreate.bind(this)}>
                    <Error message={userCreateError}/>
                    <UserForm
                        loading={ loading }
                        connections={connections}
                        createUser={this.props.createUser}
                        fetchUsers={this.props.fetchUsers}
                        userWasSaved={this.userWasSaved}
                        validationErrors={this.props.validationErrors}
                    />
                </Confirm>
                <UserOverview onReset={this.onReset} onSearch={this.onSearch}
                              error={error} users={users} total={total} loading={loading}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        error: state.users.get('error'),
        userCreateError: state.userCreate.get('error'),
        userCreateLoading: state.userCreate.get('loading'),
        validationErrors: state.userCreate.get('validationErrors'),
        loading: state.users.get('loading'),
        users: state.users.get('records').toJS(),
        connections: state.connections.get('records').toJS(),
        total: state.users.get('total'),
        nextPage: state.users.get('nextPage')
    };
}

export default connect(mapStateToProps, {...connectionActions, ...userActions})(Users);
