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

  const options = { ...opts, per_page: perPage };
  const result = [];

  let total = 0;
  let pageCount = 0;

  const getTotals = () =>
    client[entity].getAll({ ...options, include_totals: true, page: 0 })
      .then((response) => {
        total = response.total || 0;
        pageCount = Math.ceil(total / perPage);

        // if the total exceeds the limit, don't fetch any more connections from api2
        // we get some from the initial request to get totals, but we'll ignore them
        if (limit && (total > limit)) {
          pageCount = 1;
          return null;
        }

        const data = response[entity] || response || [];
        data.forEach(item => result.push(item));
        return null;
      });

  const getPage = (page) =>
    client[entity].getAll({ ...options, page })
      .then((data) => {
        data.forEach(item => result.push(item));
        return null;
      });

  const getAll = () =>
    getTotals()
      .then(() => {
        // the number of connections exceeds the limit we can handle:
        //   - don't return any to the frontend
        //   - will use a free text box in the user creation dialogue
        if (limit && (total > limit)) {
          return result;
        }

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
