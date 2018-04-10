import { createSelector } from 'reselect';

const getApps = (state) =>
  state.applications.get('records');

const getEnabledClients = (state) =>
  state.user.get('connection') && state.user.get('connection').get('enabled_clients');

const getAppsForConnection = createSelector(
  [ getApps, getEnabledClients ],
  (apps, enabledClients) => apps.filter(app => enabledClients && enabledClients.indexOf(app.get('client_id')) >= 0)
);

export default getAppsForConnection;
