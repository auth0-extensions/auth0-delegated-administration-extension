const path = require('path');

module.exports = {
  devtool: 'source-map',
  stats: true,

  entry: {
    app: path.resolve(__dirname, '../../client/app.jsx')
  },

  target: 'web',

  output: {
    path: path.join(__dirname, '../../dist/client'),
    publicPath: '/app/'
  },

  plugins: [],

  resolve: {
    alias: {
      // @a0/auth0-extension-ui statically imports react-dropzone from its barrel
      // for DragAndDrop, a component the app never uses. Stub it so webpack does
      // not need the (uninstalled) package to resolve the bundle. codemirror and
      // react-codemirror2 are NOT stubbed: the Configuration page uses the
      // library's CodeEditor, which needs them at runtime.
      'react-dropzone': path.resolve(__dirname, './empty-module.js')
    },
    modules: [ 'node_modules' ],
    extensions: [ '.json', '.js', '.jsx' ]
  }
};
