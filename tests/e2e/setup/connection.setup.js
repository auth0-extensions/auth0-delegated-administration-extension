const { test: setup, expect } = require('../fixtures');
const { DAE_CLIENT_NAME } = require('../helpers/testData');

// The tenant only lets a client create users in connections enabled for it, and the installer doesn't enable the
// test connection for DAE's own client, so creating users from DAE would fail
setup('enable the test connection for DAE\'s client', async ({ managementApi }) => {
  const connection = await managementApi.getConnectionByName(process.env.DAE_CONNECTION);
  const daeClient = await managementApi.getClientByName(DAE_CLIENT_NAME);
  expect(connection, `connection ${process.env.DAE_CONNECTION}`).toBeTruthy();
  expect(daeClient, `client ${DAE_CLIENT_NAME}`).toBeTruthy();
  await managementApi.enableConnectionForClient(connection.id, daeClient.client_id);
});
