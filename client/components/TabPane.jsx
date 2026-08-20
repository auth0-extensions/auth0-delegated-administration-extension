import React from 'react';
import PropTypes from 'prop-types';
import { Link, useMatch } from 'react-router-dom';

const TabPane = ({ route, title }) => {
  const isActive = Boolean(useMatch(`/${route}/*`));

  return (
    <li className={isActive ? 'active' : ''}>
      <Link className="script-button" to={`/${route}`} aria-expanded="true">
        <span className="tab-title">{title}</span>
      </Link>
    </li>
  );
};

TabPane.propTypes = {
  route: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default TabPane;
