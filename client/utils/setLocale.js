import axios from 'axios';

export default (location = '') => {
  const path = location.pathname.split('/');
  const routes = [
    'login',
    'logs',
    'configuration',
    'users'
  ];
  if (path.length > 1 && routes.indexOf(path[0]) < 0 && path[0] !== '') {
    localStorage.setItem('dae:locale', path[0]);
    axios.defaults.headers.common['dae-locale'] = path[0];
  }
};
