import Promise from 'bluebird';
import { ArgumentError } from 'auth0-extension-tools';

export const tooManyRecords = Symbol("Record count exceeds limit");

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
  const result = {
    success: true,
    status: "fetched records",
    data: []
  };

  let total = 0;
  let pageCount = 0;

  const getTotals = () =>
    getter({ ...options, include_totals: true, page: 0 })
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
        data.forEach(item => result.data.push(item));
        return null;
      });

  const getPage = (page) =>
    getter({ ...options, page })
      .then((data) => {
        data.forEach(item => result.data.push(item));
        return null;
      });

  const getAll = () =>
    getTotals()
      .then(() => {
        // the number of connections exceeds the limit we can handle:
        //   - don't return any to the frontend
        //   - will use a free text box in the user creation dialogue
        if (limit && (total > limit)) { 
          result.success = false;
          result.status = tooManyRecords;
          return result;
        }

        if (total === 0 || result.data.length >= total) {
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
