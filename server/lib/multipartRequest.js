import Promise from 'bluebird';
import { ArgumentError } from 'auth0-extension-tools';


export default function(client, entity, opts = {}, fetchOptions = {} ) {
  const perPage = fetchOptions.perPage || 50;
  const concurrency = fetchOptions.concurrency || 5;
  const limit = fetchOptions.limit || null;

  if (client === null || client === undefined) {
    throw new ArgumentError('Must provide a auth0 client object.');
  }

  if (!entity && !client[entity]) {
    throw new ArgumentError('Must provide a valid entity for auth0 client.');
  }

  const getter = client[entity].getAll;
  const options = { ...opts, per_page: perPage };
  const result = [];
  let total = 0;
  let pageCount = 0;

  const getTotals = () =>
    getter({ ...options, include_totals: true, page: 0 })
      .then((response) => {
        total = response.total || 0;
        if (limit) {
          total = Math.min(total, limit);
        }
        pageCount = Math.ceil(total / perPage);
        const data = response[entity] || response || [];
        data.forEach(item => result.push(item));
        return null;
      });

  const getPage = (page) =>
    getter({ ...options, page })
      .then((data) => {
        data.forEach(item => result.push(item));
        return null;
      });

  const getAll = () =>
    getTotals()
      .then(() => {
        if (total === 0 || result.length >= total) {
          return result;
        }

        const pages = [];
        for (let i=1; i<=pageCount; i++) {
          pages.push(i);
        }

        return Promise.map(pages, getPage, { concurrency });
      });

  return getAll().then(() => result);
}
