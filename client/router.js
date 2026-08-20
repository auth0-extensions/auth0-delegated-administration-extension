import { createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import routes from './routes';

const rawBasePath = (window.config && window.config.BASE_PATH) || '/';
export const basename = rawBasePath === '/' ? '/' : rawBasePath.replace(/\/$/, '');

export const router = createBrowserRouter(createRoutesFromElements(routes()), { basename });

export function navigateTo(to) {
  return router.navigate(to);
}
