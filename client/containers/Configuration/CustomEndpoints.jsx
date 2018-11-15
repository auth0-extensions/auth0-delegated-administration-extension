import React, { Component, PropTypes } from 'react';
import { LoadingPanel, Error, InputText, Form } from 'auth0-extension-ui';

import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';
import { customEndpointActions } from '../../actions';

import EndpointForm from '../../components/EndpointForm';
import getErrorMessage from '../../utils/getErrorMessage';

const defaultHandler = (
  function (req, callback) {
    // your code here
    callback(null, { status: 200, body: 'OK' });
  }
).toString();

export default connectContainer(class extends Component {
  static stateToProps = state => ({
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
      activeTab: 0
    };
  }

  componentWillMount = () => {
    this.props.fetchEndpoints();
  };

  handleSelect = (key) => {
    this.setState({ activeTab: key });
  }

  saveEndpoint = (id, name, handler, isNew) => {
    if (isNew) {
      this.props.createEndpoint(name, handler, this.props.fetchEndpoints);
    } else {
      this.props.updateEndpoint(id, name, handler, this.props.fetchEndpoints);
    }
  };

  removeEndpoint = (id) => {
    this.props.deleteEndpoint(id, this.props.fetchEndpoints);
  };

  renderTab = (endpoint, id) => {
    const isNew = !endpoint;
    const name = endpoint && endpoint.name;
    const handler = endpoint && endpoint.handler;
    return (
      <Tab key={id} eventKey={id} title={name || 'New Endpoint'}>
        <EndpointForm
          id={id}
          name={name || ''}
          handler={handler || defaultHandler}
          isNew={isNew}
          activeTab={this.state.activeTab}
          onSave={this.saveEndpoint}
          onDelete={this.removeEndpoint}
        />
      </Tab>
    );
  }

  render() {
    const { loading, error, records } = this.props.endpoints.toJS();
    const { languageDictionary, settings } = this.props;
    const originalTitle = (settings.dict && settings.dict.title) || window.config.TITLE || 'User Management';
    document.title = `${languageDictionary.customEndpointsMenuItemText || 'Custom Endpoints'} - ${originalTitle}`;

    if (records && records.length < window.config.MAX_CUSTOM_ENDPOINTS) {
      records.push(null);
    }

    return (
      <div className="endpoints">
        <div className="row content-header">
          <div className="col-xs-12 custom-endpoints-content">
            <h2>Custom Endpoints</h2>
            <p>This page allows you to fine tune the behavior of the Delegated Administration dashboard. More information and examples of hooks are available <a href="https://auth0.com/docs/extensions/delegated-admin">on the documentation page</a>.</p>
          </div>
        </div>
        <div className="custom-endpoints-tabs">
          <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
            <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error)} />
            <Tabs defaultActiveKey={this.state.activeTab} animation={false} onSelect={this.handleSelect} id="endpoints-tabs" >
              {records ? records.map(this.renderTab) : ''}
            </Tabs>
          </LoadingPanel>
        </div>
      </div>
    );
  }
});
