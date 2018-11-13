import React, { Component, PropTypes } from 'react';
import { LoadingPanel, Error, Json, InputCombo, InputText } from 'auth0-extension-ui';

import connectContainer from 'redux-static';
import { Field } from 'redux-form';
import { Tabs, Tab } from 'react-bootstrap';
import { customEndpointActions } from '../../actions';

import Editor from '../../components/Editor';
import './Configuration.css';
import getErrorMessage from '../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    endpoints: state.customEndpoints,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary && state.languageDictionary.get('record').toJS()
  });

  static actionsToProps = {
    ...customEndpointActions
  }

  static propTypes = {
    endpoints: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    fetchEndpoints: PropTypes.func.isRequired,
    createEndpoint: PropTypes.func.isRequired,
    updateEndpoint: PropTypes.func.isRequired,
    deleteEndpoint: PropTypes.func.isRequired,
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
    return this.props.endpoints !== nextProps.endpoints;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.endpoints) {
      const code = this.state.code;
      const endpoints = nextProps.endpoints.toJS();
      if (endpoints.records) {
        Object.keys(endpoints.records).forEach((endpointName) => {
          if (!code[endpointName]) {
            code[endpointName] = { ...endpoints.records[endpointName], name: endpointName };
          }
        });
      }

      this.setState({
        code
      });
    }
  }

  componentWillMount = () => {
    this.props.fetchEndpoints();
  };

  saveEndpoint = (id, isNew) => () => {
    const current = this.state.code[id];

    if (isNew) {
      this.props.createEndpoint(current.name, current.method, current.handler, this.props.fetchEndpoints);
    } else {
      this.props.updateEndpoint(id, current.name, current.method, current.handler, this.props.fetchEndpoints);
    }
  };

  removeEndpoint = name => () => {
    this.props.deleteEndpoint(name, this.props.fetchEndpoints);
  };

  onChanged = (id, type) => (value) => {
    const code = this.state.code;
    value = (value.target && value.target.value) || value;
    code[id] = code[id] || {};
    code[id][type] = value;

    this.setState({
      code
    });
  };

  renderTab = (endpoint, id) => {
    const isNew = !endpoint;
    const name = (endpoint && endpoint.name) || 'New Endpoint';
    const defaultHandler = (
      function (req, callback) {
        // your code here
        callback(null, { status: 200, body: 'OK' });
      }
    ).toString();

    return (
      <Tab eventKey={id + 1} title={name}>
        {isNew ? '' : <p> Path: {`${window.config.BASE_URL}/api/custom/${name}`} </p>}
        <InputText
          name="name"
          label="Name"
          placeholder="new-endpoint"
          required={true}
          input={{
            type: 'text',
            value: this.state.code[id] && this.state.code[id].name,
            onChange: this.onChanged(id, 'name')
          }}
        />
        <InputCombo
          name="method"
          label={'Method'}
          input={{ value: isNew ? 'GET' : endpoint.method, onChange: this.onChanged(name, 'method') }}
          options={[
            { value: 'GET', text: 'GET' },
            { value: 'POST', text: 'POST' },
            { value: 'PUT', text: 'PUT' },
            { value: 'PATCH', text: 'PATCH' },
            { value: 'DELETE', text: 'DELETE' }
            ]}
          onChange={this.onChanged(id, 'method')}
        />
        <Editor
          value={isNew ? defaultHandler : endpoint.handler}
          onChange={this.onChanged(id, 'handler')}
        />
        <div className="save-config">
          <button onClick={this.saveEndpoint(id, isNew)} className="btn btn-success">{isNew ? 'Create' : 'Update'} Endpoint</button>
          {isNew ? '' : <button onClick={this.removeEndpoint(id)} className="btn btn-danger">Remove</button>}
        </div>
      </Tab>
    );
  }

  render() {
    const { loading, error, records } = this.props.endpoints.toJS();
    const { languageDictionary, settings } = this.props;
    const originalTitle = (settings.dict && settings.dict.title) || window.config.TITLE || 'User Management';
    document.title = `${languageDictionary.customEndpointsMenuItemText || 'Custom Endpoints'} - ${originalTitle}`;

    return (
      <div className="endpoints">
        <div className="row content-header">
          <div className="col-xs-12 user-table-content">
            <h2>Custom Endpoints</h2>
            <p>This page allows you to fine tune the behavior of the Delegated Administration dashboard. More information and examples of hooks are available <a href="https://auth0.com/docs/extensions/delegated-admin">on the documentation page</a>.</p>
          </div>
        </div>
        <div className="row endpoints-tabs">
          <div className="col-xs-12">
            <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
              <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error)} />
              <Tabs defaultActiveKey={this.state.activeTab} animation={false} id="endpoints-tabs" >
                {records.map((endpoint, id) => this.renderTab(endpoint, id))}
                {this.renderTab(null, records.length)}
              </Tabs>
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
});
