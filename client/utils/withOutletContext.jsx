import React from 'react';
import { useOutletContext } from 'react-router-dom';

// Used to propagate accessLevel/appSettings/getDictValue to child components via <Outlet>.
// This context allows components to access those values.
export default function withOutletContext(Component) {
  function ComponentWithOutletContext(props) {
    const context = useOutletContext() || {};
    return <Component {...context} {...props} />;
  }

  return ComponentWithOutletContext;
}
