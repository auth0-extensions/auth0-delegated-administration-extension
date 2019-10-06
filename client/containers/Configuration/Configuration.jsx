import React, { Component, PropTypes } from 'react';
import { LoadingPanel, Error, Json } from 'auth0-extension-ui';

import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';
import { scriptActions } from '../../actions';

import Editor from '../../components/Editor';
import './Configuration.css';
import getErrorMessage from '../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    scripts: state.scripts,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary && state.languageDictionary.get('record').toJS()
  });

  static actionsToProps = {
    ...scriptActions
  }

  static propTypes = {
    scripts: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    fetchScript: PropTypes.func.isRequired,
    updateScript: PropTypes.func.isRequired,
    languageDictionary: PropTypes.object
  }

  static defaultProps = {
    languageDictionary: {}
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
    const { languageDictionary, settings } = this.props;
    const originalTitle = (settings.dict && settings.dict.title) || window.config.TITLE || 'User Management';
    document.title = `${languageDictionary.configurationMenuItemText || 'Configuration'} - ${originalTitle}`;

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
                  <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, scripts.filter && scripts.filter.error)} />
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
                  <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, scripts.access && scripts.access.error)} />
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
                  <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, scripts.create && scripts.create.error)} />
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
                  <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, scripts.memberships && scripts.memberships.error)} />
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
              <Tab eventKey={5} title={code.settings && code.settings.length ? <span>Settings Query Hook</span> : <i>Settings Query Hook</i>}>
                <LoadingPanel show={scripts.settings && scripts.settings.loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
                  <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, scripts.settings && scripts.settings.error)} />
                  <p>
                    With the <strong>settings query hook</strong> you can control the title and the look-and-feel of the
                    dashboard after the user has logged in.
                  </p>
                  <Editor
                    value={code.settings || ''}
                    onChange={this.onEditorChanged('settings')}
                  />
                  <div className="save-config">
                    <button onClick={this.saveScript('settings')} className="btn btn-success">
                      Save Settings Query Hook
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
