import React, { Component } from 'react';

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
      currentCode: 1
    };
  }

  componentWillMount = () => {
    this.props.fetchScripts();
  };

  updateCode = (newCode) => {
    switch (this.state.currentCode) {
      case 1:
        this.setState({ access: newCode });
        break;
      case 2:
        this.setState({ filter: newCode });
        break;
      case 3:
        this.setState({ memberships: newCode });
        break;
      case 4:
        this.setState({ write: newCode });
        break;
    }
  };

  onChange = (index) => {
    this.setState({ currentCode: index });
  };

  saveConfiguration = () => {
    let data = {};
    data['access'] = this.state.write;
    data['filter'] = this.state.filter;
    data['memberships'] = this.state.memberships;
    data['write'] = this.state.write;
    this.props.updateScripts(data);
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
            <Tabs defaultActiveKey={1} animation={false} onSelect={this.onChange.bind(this)}>
              <Tab eventKey={1} title="Access Query">
                <Codemirror value={this.state.access} onChange={this.updateCode} options={options}/>
              </Tab>
              <Tab eventKey={2} title="Filter Query">
                <Codemirror value={this.state.filter} onChange={this.updateCode} options={options}/>
              </Tab>
              <Tab eventKey={3} title="Memberships Query">
                <Codemirror value={this.state.memberships} onChange={this.updateCode} options={options}/>
              </Tab>
              <Tab eventKey={4} title="Write Query">
                <Codemirror value={this.state.write} onChange={this.updateCode} options={options}/>
              </Tab>
            </Tabs>
            <div className="saveConfigurationButton">
              <button onClick={this.saveConfiguration.bind(this)} className="btn btn-success">Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.scripts.get('error'),
    scripts: state.scripts.get('records'),
    access: state.scripts.get('records') ? state.scripts.get('records').access : '',
    filter: state.scripts.get('records') ? state.scripts.get('records').filter : '',
    memberships: state.scripts.get('records') ? state.scripts.get('records').memberships : '',
    write: state.scripts.get('records') ? state.scripts.get('records').write : '',
    loading: state.scripts.get('loading')
  };
}

export default connect(mapStateToProps, { ...scriptActions })(Configuration);
