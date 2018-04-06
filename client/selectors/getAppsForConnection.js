import { createSelector } from 'reselect';

const getApps = (state) =>
  state.applications.get('records');

const getConnection = (state) =>
  state.user.get('connection');

const getAppsForConnection = createSelector(
  [ getApps, getConnection ],
  (apps, connection) => apps.filter(app => connection && connection.get('enabled_clients').indexOf(app.get('client_id')) >= 0)
);

export default getAppsForConnection;
