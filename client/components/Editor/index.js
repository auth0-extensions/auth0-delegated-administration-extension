import React, { Component, PropTypes } from 'react';
import CodeMirror from 'react-codemirror';

import 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/hint/show-hint.css';

import './editor.css';

export default class Editor extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    value: '',
    options: {
      mode: 'javascript',
      lineWrapping: true,
      continueComments: 'Enter',
      matchBrackets: true,
      styleActiveLine: true,
      closeBrackets: true,
      indentUnit: 2,
      smartIndent: true,
      autofocus: true,
      tabSize: 2,
      lint: {
        options: {
          sub: true,
          noarg: true,
          undef: true,
          eqeqeq: true,
          laxcomma: true,
          '-W025': true,
          predef: [ 'module' ]
        }
      }
    }
  }

  constructor() {
    super();
    this.state = {
      value: null
    };
  }

  componentDidMount() {
    const { editor } = this.refs;
    editor.getCodeMirror().refresh();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.value, this.state.value);
    if (nextProps.value && !this.state.value) {
      const { editor } = this.refs;
      if (editor) {
        editor.getCodeMirror().setValue(nextProps.value);
      }
    }
  }

  componentDidUpdate() {
    const { editor } = this.refs;
    editor.getCodeMirror().refresh();
  }

  onChange = (code) => {
    this.setState({
      value: code
    });

    if (this.props.onChange) {
      this.props.onChange(code);
    }
  };

  render() {
    const { value, options } = this.props;
    return (
      <CodeMirror
        ref="editor"
        value={this.state.value || value || ''}
        onChange={this.onChange}
        options={options}
      />
  );
  }
}
