import React from 'react';
import { NavigationLink } from '../components/Dashboard';

export default () => (
  <div className="widget-title title-with-nav-bars">
    <ul className="nav nav-tabs">
      <NavigationLink title="Users" route="/users" />
      <NavigationLink title="Logs" route="/logs" />
    </ul>
  </div>
);
