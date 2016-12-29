import React, { Component, PropTypes } from 'react';
import { LoadingPanel, Error, Json } from 'auth0-extension-ui';

import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';
import { scriptActions } from '../../actions';

import Editor from '../../components/Editor';
import './Configuration.css';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    scripts: state.scripts
  });

  static actionsToProps = {
    ...scriptActions
  }

  static propTypes = {
    scripts: PropTypes.object.isRequired,
    fetchScript: PropTypes.func.isRequired,
    updateScript: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 1,
      code: { }
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.scripts !== nextProps.scripts;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scripts) {
      const code = this.state.code;
      const scripts = nextProps.scripts.toJS();
      Object.keys(scripts).forEach(scriptName => {
        if (!code[scriptName]) {
          code[scriptName] = scripts[scriptName].script;
        }
      });

      this.setState({
        code
      });
    }
  }

  componentWillMount = () => {
    this.props.fetchScript('access');
    this.props.fetchScript('filter');
    this.props.fetchScript('create');
    this.props.fetchScript('memberships');
    this.props.fetchScript('settings');
    this.props.fetchScript('customfields');
  };

  saveScript = (name) => () => {
    this.props.updateScript(name, this.state.code[name]);
  };

  onEditorChanged = (name) => (value) => {
    const code = this.state.code;
    code[name] = value;

    this.setState({
      code
    });
  };

  render() {
    const code = this.state.code;
    const scripts = this.props.scripts.toJS();

    return (
      <div className="configuration">
        <div className="row content-header">
          <div className="col-xs-12 user-table-content">
            <h2>Configuration</h2>
            <p>This configuration page allows you to fine tune the behavior of the Delegated Administration dashboard. More information and examples of hooks are available <a href="https://auth0.com/docs/extensions/delegated-admin">on the documentation page</a>.</p>
          </div>
        </div>
        <div className="row configuration-tabs">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="configuration-tabs" >
              <Tab eventKey={1} title={code.filter && code.filter.length ? <span>Filter Hook</span> : <i>Filter Hook</i>}>
                <LoadingPanel show={scripts.filter && scripts.filter.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <Error message={scripts.filter && scripts.filter.error} />
                  <p>
                    The <strong>filter hook</strong> allows you to specify which records are shown to the current
                    users when loading the list of users or searching. For example: <i>Only show users from my department</i>.
                    This has to be defined using the lucene syntax.
                  </p>
                  <Editor
                    value={code.filter || ''}
                    onChange={this.onEditorChanged('filter')}
                  />
                  <div className="save-config">
                    <button onClick={this.saveScript('filter')} className="btn btn-success">Save Filter Hook
                    </button>
                  </div>
                </LoadingPanel>
              </Tab>
              <Tab eventKey={2} title={code.access && code.access.length ? <span>Access Hook</span> : <i>Access Hook</i>}>
                <LoadingPanel show={scripts.access && scripts.access.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <Error message={scripts.access && scripts.access.error} />
                  <p>
                    The <strong>access hook</strong> will allow you to specify if the current user is allowed to
                    access a specific user (eg: view the details, delete the user, ...).
                  </p>
                  <Editor
                    value={code.access || ''}
                    onChange={this.onEditorChanged('access')}
                  />
                  <div className="save-config">
                    <button onClick={this.saveScript('access')} className="btn btn-success">
                      Save Access Hook
                    </button>
                  </div>
                </LoadingPanel>
              </Tab>
              <Tab eventKey={3} title={code.create && code.create.length ? <span>Write Hook</span> : <i>Write Hook</i>}>
                <LoadingPanel show={scripts.create && scripts.create.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <Error message={scripts.create && scripts.create.error} />
                  <p>
                    The <strong>write hook</strong> will run every time a new user is created. This hook will allow
                    you to shape the user object before it's sent to Auth0. The context object contains the request (with the current user) and the payload sent by the end user.
                  </p>
                  <Editor
                    value={code.create || ''}
                    onChange={this.onEditorChanged('create')}
                  />
                  <div className="save-config">
                    <button onClick={this.saveScript('create')} className="btn btn-success">
                      Save Write Hook
                    </button>
                  </div>
                </LoadingPanel>
              </Tab>
              <Tab eventKey={4} title={code.memberships && code.memberships.length ? <span>Memberships Hook</span> : <i>Memberships Hook</i>}>
                <LoadingPanel show={scripts.memberships && scripts.memberships.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <Error message={scripts.memberships && scripts.memberships.error} />
                  <p>
                    With the <strong>membership query</strong> you can specify in which groups the current user can
                    create new users. Only in their own department? Or other departments also?
                  </p>
                  <Editor
                    value={code.memberships || ''}
                    onChange={this.onEditorChanged('memberships')}
                  />
                  <div className="save-config">
                    <button onClick={this.saveScript('memberships')} className="btn btn-success">
                      Save Memberships Query
                    </button>
                  </div>
                </LoadingPanel>
              </Tab>
              <Tab eventKey={5} title={code.settings && code.settings.length ? <span>Settings Query</span> : <i>Settings Query</i>}>
                <LoadingPanel show={scripts.settings && scripts.settings.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <Error message={scripts.settings && scripts.settings.error} />
                  <p>
                    With the <strong>settings query</strong> you can control the title and the look-and-feel of the
                    dashboard after the user has logged in?
                  </p>
                  <Editor
                    value={code.settings || ''}
                    onChange={this.onEditorChanged('settings')}
                  />
                  <div className="save-config">
                    <button onClick={this.saveScript('settings')} className="btn btn-success">
                      Save Settings Query
                    </button>
                  </div>
                </LoadingPanel>
              </Tab>
              <Tab eventKey={6} title={code.customfields && code.customfields.length ? <span>Custom Fields</span> : <i>Custom Fields</i>}>
                <LoadingPanel show={scripts.customfields && scripts.customfields.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <Error message={scripts.customfields && scripts.customfields.error} />
                  <p>
                    With the <strong>custom fields</strong> you can add more fields to the create user form.
                    You can use <a href="https://github.com/auth0-extensions/auth0-extension-ui">auth0-extension-ui</a> components to add more fields and you should use JSON syntax to add them. The supported components are <strong>InputText</strong> and <strong>InputCombo</strong>. Don't forget to decide what do to with added fields in 'Write Hook'.
                  </p>
                  <p>Example:</p>
                  <p>
                    { JSON.stringify([
                    {
                      "name": "phone",
                      "type": "text",
                      "label": "Phone",
                      "component": "InputText"
                    },
                    {
                      "name": "gender",
                      "type": "select",
                      "options": [ "male", "female" ],
                      "label": "Gender",
                      "component": "InputCombo"
                    }
                  ]) }
                  </p>
                  <Editor
                    value={code.customfields || ''}
                    onChange={this.onEditorChanged('customfields')}
                  />
                  <div className="save-config">
                    <button onClick={this.saveScript('customfields')} className="btn btn-success">
                      Save Custom Fields
                    </button>
                  </div>
                </LoadingPanel>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
});
