import React, { Component } from 'react';

import Codemirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/theme/mbo.css';

import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { connectionActions, userActions } from '../../actions';

import './Configuration.css';

class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// Code example 1' +
      '' +
      '' +
      '' +
      ''
    };
  }

  componentWillMount = () => {
    this.props.fetchUsers();
    this.props.fetchConnections();
  };

  updateCode = (newCode) => {
    this.setState({
      code: newCode
    });
  };

  render() {
    const jsHintOptions = {
      options: {
        'sub': true,
        'noarg': true,
        'undef': true,
        'eqeqeq': true,
        'laxcomma': true,
        '-W025': true,
        'predef': ['module']
      }
    };
    const options = {
      mode: 'javascript',
      lineNumbers: true,
      lineWrapping: true,
      continueComments: 'Enter',
      matchBrackets: true,
      styleActiveLine: true,
      closeBrackets: true,
      indentUnit: 2,
      smartIndent: true,
      tabSize: 2,
      gutters: ['CodeMirror-lint-markers'],
      theme: 'mbo',
      lint: jsHintOptions
    };

    return (
      <div className="users">
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Access Query">
                <Codemirror value={this.state.code} onChange={this.updateCode} options={options}/>
              </Tab>
              <Tab eventKey={2} title="Filter Query">
                <Codemirror value={this.state.code} onChange={this.updateCode} options={options}/>
              </Tab>
              <Tab eventKey={3} title="Memberships Query">
                <Codemirror value={this.state.code} onChange={this.updateCode} options={options}/>
              </Tab>
              <Tab eventKey={4} title="Write Query">
                <Codemirror value={this.state.code} onChange={this.updateCode} options={options}/>
              </Tab>
            </Tabs>
          </div>
        </div>
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

export default connect(mapStateToProps, { ...connectionActions, ...userActions })(Configuration);
