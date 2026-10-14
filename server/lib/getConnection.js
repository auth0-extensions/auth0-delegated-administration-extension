export default function (client, name) {
  return client.connections.getAll({ name }).then(({ data: connections }) => connections && connections[0]);
}
