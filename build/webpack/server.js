const { startDevServer } = require('auth0-extensions-cli');

const rootPath = process.cwd();
const entry = './client/app.jsx';
const destination = './dist';

startDevServer(rootPath, entry, destination)
  .then(() => require('../../index'))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
