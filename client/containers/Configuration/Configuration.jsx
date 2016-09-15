import React, { Component } from 'react';
import { LoadingPanel, Error } from '../../components/Dashboard';

import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { scriptActions } from '../../actions';

import Editor from '../../components/Editor';
import './Configuration.css';

class Configuration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 1,
      scripts: props.scripts || { }
    };
  }

  componentWillMount = () => {
    this.props.fetchScript('access');
    this.props.fetchScript('filter');
    this.props.fetchScript('create');
    this.props.fetchScript('memberships');
    this.props.fetchScript('settings');
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      scripts: nextProps.scripts.toJS()
    });
  }

  updateScript = (name) => (code) => {
    const scripts = this.state.scripts;
    scripts[name] = code;
    this.setState({
      scripts
    });
  };

  saveScript = (name) => () => {
    this.props.updateScript(name, this.state.scripts[name]);
  };

  getValue = (scripts, index) => {
    const val = scripts.get(index);
    if (val) {
      return val.toString();
    }

    return '';
  };


  render() {
    const { scripts, loading, error } = this.props;

    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error} />
        <div className="users">
          <div className="row content-header">
            <div className="col-xs-12 userTableContent">
              <h2>Configuration</h2>
              <p>This configuration page allows you to fine tune the behavior of the Delegated Administration dashboard.</p>
            </div>
          </div>
          <div className="row user-tabs">
            <div className="col-xs-12">
              <Tabs defaultActiveKey={this.state.activeTab} animation={false}>
                <Tab eventKey={1} title="Filter Hook">
                  <p>The <strong>filter hook</strong> allows you to specify which records are shown to the current users when loading the list of users or searching. For example: <i>Only show users from my department</i>. This has to be defined using the lucene syntax.</p>
                  <Editor
                    value={this.state.scripts.filter}
                    onChange={this.updateScript('filter')}
                  />
                  <div className="saveConfigurationButton">
                    <button onClick={this.saveScript('filter')} className="btn btn-success">Save Filter Hook
                    </button>
                  </div>
                </Tab>
                <Tab eventKey={2} title="Access Hook">
                  <p>The <strong>access hook</strong> will allow you to specify if the current user is allowed to access a specific user (eg: view the details, delete the user, ...).</p>
                  <Editor
                    value={this.state.scripts.access}
                    onChange={this.updateScript('access')}
                  />
                  <div className="saveConfigurationButton">
                    <button onClick={this.saveScript('access')} className="btn btn-success">Save Access Hook</button>
                  </div>
                </Tab>
                <Tab eventKey={4} title="Create Hook">
                  <p>The <strong>create hook</strong> will run every time a new user is created. This hook will allow you to shape the user object before it's sent to Auth0. The context object contains the request (with the current user) and the payload sent by the end user.</p>
                  <Editor
                    value={this.state.scripts.create}
                    onChange={this.updateScript('create')}
                  />
                  <div className="saveConfigurationButton">
                    <button onClick={this.saveScript('create')} className="btn btn-success">Save Create Query
                    </button>
                  </div>
                </Tab>
                <Tab eventKey={3} title="Memberships Query">
                  <p>With the <strong>membership query</strong> you can specify in which groups the current user can create new users. Only in their own department? Or other departments also?</p>
                  <Editor
                    value={this.state.scripts.memberships}
                    onChange={this.updateScript('memberships')}
                  />
                  <div className="saveConfigurationButton">
                    <button onClick={this.saveScript('memberships')} className="btn btn-success">Save Memberships Query
                    </button>
                  </div>
                </Tab>
                <Tab eventKey={5} title="Settings Query">
                  <p>With the <strong>settings query</strong> you can control the title and the look-and-feel of the dashboard after the user has logged in?</p>
                  <Editor
                    value={this.state.scripts.settings}
                    onChange={this.updateScript('settings')}
                  />
                  <div className="saveConfigurationButton">
                    <button onClick={this.saveScript('settings')} className="btn btn-success">Save Settings Query
                    </button>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </LoadingPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.scripts.get('error'),
    scripts: state.scripts.get('records'),
    loading: state.scripts.get('loading')
  };
}

export default connect(mapStateToProps, { ...scriptActions })(Configuration);
