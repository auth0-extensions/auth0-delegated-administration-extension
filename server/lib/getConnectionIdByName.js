import Promise from 'bluebird';

export default function (client, name) {
  const connection = Array.isArray(global.connections) && global.connections.filter(conn => conn.name === name)[0];
  if (connection) {
    return Promise.resolve(connection.id);
  }

  return client.connections.getAll({ name, fields: 'id' })
    .then(connections => connections && connections[0] && connections[0].id);
}
