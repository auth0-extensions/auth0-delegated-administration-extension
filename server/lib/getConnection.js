export default function (client, name) {
  return client.connections.getAll({ name }).then(connections => connections && connections[0]);
}
