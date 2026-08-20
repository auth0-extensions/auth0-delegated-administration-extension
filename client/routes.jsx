import React from 'react';  // eslint-disable-line no-unused-vars
import { Route, Navigate } from 'react-router-dom';  // eslint-disable-line no-unused-vars

import * as containers from './containers';
import withRouter from './utils/withRouter';
import withOutletContext from './utils/withOutletContext';

const RequireApp = withRouter(containers.RequireAuthentication(containers.App));

// App renders route children through <Outlet> and passes accessLevel/appSettings/getDictValue down as Outlet context
const Users = withOutletContext(containers.Users);
const Logs = withOutletContext(containers.Logs);
const User = withRouter(withOutletContext(containers.User));
const Login = withRouter(containers.Login);

export default () =>
  <React.Fragment>
    <Route path="/" element={<RequireApp />}>
      <Route index element={<Navigate to="/users" replace />} />
      <Route path="logs" element={<Logs />} />
      <Route path="configuration" element={<containers.Configuration />} />
      <Route path="users" element={<Users />} />
      <Route path="users/:id" element={<User />} />
    </Route>
    <Route path="/login" element={<Login />} />
  </React.Fragment>;
