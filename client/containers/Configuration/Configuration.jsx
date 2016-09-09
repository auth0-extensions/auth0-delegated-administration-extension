import React, { Component } from 'react';
import { LoadingPanel, Error } from '../../components/Dashboard';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/theme/mbo.css';

import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { scriptActions } from '../../actions';

import './Configuration.css';

class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCode: 1,
      confAccess: '',
      confFilter: '',
      confMemberships: '',
      confWrite: '',
      confStyles: ''
    };
  }

  componentWillMount = () => {
    this.props.fetchScripts();
  };

  updateCode = (newCode) => {
    switch (this.state.currentCode) {
      case 1:
        this.setState({ confAccess: newCode });
        break;
      case 2:
        this.setState({ confFilter: newCode });
        break;
      case 3:
        this.setState({ confMemberships: newCode });
        break;
      case 4:
        this.setState({ confWrite: newCode });
        break;
      case 5:
        this.setState({ confStyles: newCode });
        break;
    }
    return newCode;
  };

  onChange = (index) => {
    this.setState({ currentCode: index });
  };

  saveConfiguration = () => {
    let data = {};
    data['access'] = this.state.confAccess || this.props.access;
    data['filter'] = this.state.confFilter || this.props.filter;
    data['memberships'] = this.state.confMemberships || this.props.memberships;
    data['write'] = this.state.confWrite || this.props.write;
    data['styles'] = this.state.confStyles || this.props.styles;
    this.props.updateScripts(data);

  };

  saveOneScript = (attr) => {
    let data = {};
    switch (attr) {
      case 'access':
        data['script'] = this.state.confAccess || this.props.access;
        break;
      case 'filter':
        data['script'] = this.state.confFilter || this.props.filter;
        break;
      case 'memberships':
        data['script'] = this.state.confMemberships || this.props.memberships;
        break;
      case 'write':
        data['script'] = this.state.confWrite || this.props.write;
        break;
      case 'styles':
        data['script'] = this.state.confStyles || this.props.styles;
        break;
    }
    this.props.updateScript(attr, data);
  };

  getValue = (scripts, index) => {
    const val = scripts.get(index);
    if (val) {
      return val.toString();
    } else {
      return '';
    }
  };

  render() {
    const { scripts, loading, error } = this.props;
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
      autofocus: true,
      tabSize: 2,
      gutters: ['CodeMirror-lint-markers'],
      theme: 'mbo',
      lint: jsHintOptions
    };
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}/>
        <div className="users">
          <div className="row content-header">
            <div className="col-xs-12 userTableContent">
              <h2>Configurations</h2>
            </div>
          </div>
          <div className="row user-tabs">
            <div className="col-xs-12">
              { scripts ?
                <Tabs defaultActiveKey={1} animation={false} onSelect={this.onChange.bind(this)}>
                  <Tab eventKey={1} title="Access Query">
                    <Codemirror value={ this.getValue(scripts, 'access') }
                                onChange={this.updateCode}
                                options={options}
                                className="access"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveConfiguration.bind(this)} className="btn btn-success">Save Access Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={2} title="Filter Query">
                    <Codemirror value={this.getValue(scripts, 'filter')}
                                onChange={this.updateCode}
                                options={options}
                                className="filter"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveConfiguration.bind(this)} className="btn btn-success">Save Filter Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={3} title="Memberships Query">
                    <Codemirror value={this.getValue(scripts, 'memberships')}
                                onChange={this.updateCode}
                                options={options}
                                className="memberships"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveConfiguration.bind(this)} className="btn btn-success">Save Memberships
                        Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={4} title="Write Query">
                    <Codemirror value={this.getValue(scripts, 'write')}
                                onChange={this.updateCode}
                                options={options}
                                className="write"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveConfiguration.bind(this)} className="btn btn-success">Save Write Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={5} title="Styles">
                    <Codemirror value={this.getValue(scripts, 'styles')}
                                onChange={this.updateCode}
                                options={options}
                                className="styles"
                    />
                    <Codemirror className="hidden" value=""/>
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveConfiguration.bind(this)} className="btn btn-success">Save Styles
                      </button>
                    </div>
                  </Tab>
                </Tabs>
                : ''}
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
    access: state.scripts.get('records') ? state.scripts.get('records').get('access') : '',
    filter: state.scripts.get('records') ? state.scripts.get('records').get('filter') : '',
    memberships: state.scripts.get('records') ? state.scripts.get('records').get('memberships') : '',
    write: state.scripts.get('records') ? state.scripts.get('records').get('write') : '',
    styles: state.scripts.get('records') ? state.scripts.get('records').get('styles') : '',
    loading: state.scripts.get('loading')
  };
}

export default connect(mapStateToProps, { ...scriptActions })(Configuration);
