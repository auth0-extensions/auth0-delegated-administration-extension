import React, { Component, PropTypes } from 'react';

export default class DaeExtendEditor extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props.token !== nextProps.token || this.props.name !== nextProps.name;
  }

  componentDidMount() {
    const editorOptions = {
      webtaskName: `auth0-delegated-admin-${this.name}`,
      token: this.token,
      webtaskContainer: window.config.AUTH0_DOMAIN.split('.')[0],
      hostUrl: 'https://sandbox.it.auth0.com',
      theme: 'light',
      allowRenaming: false,
      allowCreating: false,
      allowSwitching: false,
      allowSwitchingTemplates: false,
      createIfNotExists: {
        category: 'update-hook',
        enabled: true
      },
      allowEditingSchedule: false,
      allowEditingMeta: false,
      fullscreen: {
        enabled: true,
        height: '90%',
        width: '90%'
      },
      runner: {
        methods: ['POST'],
        methodSelector: false,
        headersEditor: {
          defaultHeaders: {
            'Content-Type': 'application/json',
            Authorization: function(secrets) {
              var token = secrets ? secrets['auth0-extension-secret'] : '';
              return 'Bearer ' + token;
            }
          }
        }
      },
      categories: [{
        name: 'update-hook',
        description: 'Allow users to set the update hook',
        icon: 'wt-icon-717',
        templates: [{
          default: true,
          name: 'empty-function',
          meta: {
            'wt-editor': 'https://cdn.auth0.com/webtask-editor/editors/1/function-editor.js',
            'wt-editor-icon': 'wt-icon-717'
          },
          code: [
            'module.exports = function(context, cb) {',
            '  cb(null, { hello: context.data.name || \'Anonymous\' });',
            '};',
          ].join('\n')
        }]
      }]

    };

    this.editorObject.create(this.editorContainer, editorOptions);
  }

  render() {
    this.token = this.props.token;
    this.name = this.props.name;

    return (
      <div >
        <h1>Update Hook</h1>

        <div
          style={{ height: '500px' }}
          ref={(c) => {
            this.editorContainer = c;
            this.editorObject = ExtendEditor;
          }}
        ></div>

        <div
          style={{ marginTop: '21px' }}
          className="alert alert-warning"
        >Please note that <strong>trying</strong> the hook will save it as well, overwriting its code.
        </div>
      </div>
    );
  }
}