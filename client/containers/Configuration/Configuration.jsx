import React, { Component, PropTypes } from 'react';
import { LoadingPanel, Error } from '../../components/Dashboard';

import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { scriptActions } from '../../actions';

import Editor from '../../components/Editor';
import './Configuration.css';

class Configuration extends Component {
  static propTypes = {
    fetchScript: PropTypes.func.isRequired,
    updateScript: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 1,
      scripts: props.scripts || {},
      errors: {}
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.scripts !== nextProps.scripts ||
      this.props.updateError !== nextProps.updateError ||
      this.props.updatedScript !== nextProps.updatedScript ||
      this.props.updateLoading !== nextProps.updateLoading;
  }

  componentWillMount = () => {
    this.props.fetchScript('access');
    this.props.fetchScript('filter');
    this.props.fetchScript('create');
    this.props.fetchScript('memberships');
    this.props.fetchScript('settings');
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.updatedScript) {
      let errors = this.state.errors;
      if (nextProps.updateError) {
        if (!errors[nextProps.updatedScript] || errors[nextProps.updatedScript] !== nextProps.updateError) {
          errors[nextProps.updatedScript] = nextProps.updateError;
          this.setState({
            errors: errors,
            scripts: nextProps.scripts.toJS()
          });
          return;
        }
      } else {
        if (errors[nextProps.updatedScript]) {
          errors[nextProps.updatedScript] = null;
          this.setState({
            errors: errors,
            scripts: nextProps.scripts.toJS()
          });
          return;
        }
      }
    }
    this.setState({
      scripts: nextProps.scripts.toJS()
    });
  }

  getValue = (scripts, index) => {
    const val = scripts.get(index);
    if (val) {
      return val.toString();
    }

    return '';
  };

  saveScript = (name) => () => {
    this.props.updateScript(name, this.state.scripts[name]);
  };

  updateScript = (name) => (code) => {
    const scripts = this.state.scripts;
    scripts[name] = code;
    this.setState({
      scripts
    });
  };

  render() {
    const { loading, error, updateLoading, updatedScript } = this.props;
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error} />
        <div className="users">
          <div className="row content-header">
            <div className="col-xs-12 userTableContent">
              <h2>Configuration</h2>
              <p>This configuration page allows you to fine tune the behavior of the Delegated Administration
                dashboard.
              </p>
            </div>
          </div>
          <div className="row user-tabs">
            <div className="col-xs-12">
              <Tabs defaultActiveKey={this.state.activeTab} animation={false}>
                <Tab eventKey={1} title="Filter Hook">
                  <LoadingPanel show={updateLoading && updatedScript === 'filter'}
                                animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                    <p>The <strong>filter hook</strong> allows you to specify which records are shown to the current
                      users when loading the list of users or searching. For example: <i>Only show users from my
                        department </i>. This has to be defined using the lucene syntax.</p>
                    <Error message={this.state.errors.filter} />
                    <Editor
                      value={String(this.state.scripts.filter)}
                      onChange={this.updateScript('filter')}
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveScript('filter')} className="btn btn-success">Save Filter Hook
                      </button>
                    </div>
                  </LoadingPanel>
                </Tab>
                <Tab eventKey={2} title="Access Hook">
                  <LoadingPanel show={updateLoading && updatedScript === 'access'}
                                animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                    <p>The <strong>access hook</strong> will allow you to specify if the current user is allowed to
                      access a specific user (eg: view the details, delete the user, ...)
                    </p>
                    <Error message={this.state.errors.access} />
                    <Editor
                      value={String(this.state.scripts.access)}
                      onChange={this.updateScript('access')}
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveScript('access')} className="btn btn-success">Save Access Hook</button>
                    </div>
                  </LoadingPanel>
                </Tab>
                <Tab eventKey={4} title="Create Hook">
                  <LoadingPanel show={updateLoading && updatedScript === 'create'}
                                animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                    <p>The <strong>create hook</strong> will run every time a new user is created. This hook will allow
                      you to shape the user object before it's sent to Auth0. The context object contains the request
                      (with the current user) and the payload sent by the end user.
                    </p>
                    <Error message={this.state.errors.create} />
                    <Editor
                      value={String(this.state.scripts.create)}
                      onChange={this.updateScript('create')}
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveScript('create')} className="btn btn-success">Save Create Query
                      </button>
                    </div>
                  </LoadingPanel>
                </Tab>
                <Tab eventKey={3} title="Memberships Query">
                  <LoadingPanel show={updateLoading && updatedScript === 'memberships'}
                                animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                    <p>With the <strong>membership query</strong> you can specify in which groups the current user can
                      create new users. Only in their own department? Or other departments also?
                    </p>
                    <Error message={this.state.errors.memberships} />
                    <Editor
                      value={String(this.state.scripts.memberships)}
                      onChange={this.updateScript('memberships')}
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveScript('memberships')} className="btn btn-success">Save Memberships
                        Query
                      </button>
                    </div>
                  </LoadingPanel>
                </Tab>
                <Tab eventKey={5} title="Settings Query">
                  <LoadingPanel show={updateLoading && updatedScript === 'settings'}
                                animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                    <p>With the <strong>settings query</strong> you can control the title and the look-and-feel of the
                      dashboard after the user has logged in?
                    </p>
                    <Error message={this.state.errors.settings} />
                    <Editor
                      value={String(this.state.scripts.settings)}
                      onChange={this.updateScript('settings')}
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveScript('settings')} className="btn btn-success">Save Settings Query
                      </button>
                    </div>
                  </LoadingPanel>
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
    updateError: state.updateScript.get('error'),
    updatedScript: state.updateScript.get('script'),
    updateLoading: state.updateScript.get('loading'),
    scripts: state.scripts.get('records'),
    loading: state.scripts.get('loading')
  };
}

export default connect(mapStateToProps, { ...scriptActions })(Configuration);
