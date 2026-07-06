import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
  getFilterableUserFields,
  validateLuceneQuery
} from '../../../client/utils/userSearchParams';

describe('Client-Utils-userSearchParams', () => {
  const userFields = [
    {
      label: 'Contact ID',
      property: 'app_metadata.contactId',
      search: { filter: true }
    },
    {
      label: 'Email',
      property: 'email',
      search: { filter: true }
    }
  ];

  it('returns filterable user fields as search options', () => {
    expect(getFilterableUserFields(userFields)).to.deep.equal([
      {
        title: 'Contact ID',
        value: 'app_metadata.contactId',
        filterBy: 'app_metadata.contactId'
      },
      {
        title: 'Email',
        value: 'email',
        filterBy: 'email'
      }
    ]);
    expect(getFilterableUserFields([])).to.deep.equal([]);
  });

  it('accepts valid lucene search params', () => {
    expect(validateLuceneQuery('email:"john@doe.com"')).to.deep.equal({ valid: true });
    expect(validateLuceneQuery('name:john OR email:jane')).to.deep.equal({ valid: true });
  });

  it('rejects invalid lucene search params', () => {
    expect(validateLuceneQuery('foo) OR (user_id:evil')).to.deep.equal({
      valid: false,
      error: 'Invalid Lucene search syntax'
    });
  });

  it('rejects lucene search params that are too long', () => {
    const search = `email:${'a'.repeat(256)}`;
    expect(validateLuceneQuery(search)).to.deep.equal({
      valid: false,
      error: 'Search query is too long'
    });
  });

  it('rejects lucene search params with control characters', () => {
    expect(validateLuceneQuery('email:john\x00doe')).to.deep.equal({
      valid: false,
      error: 'Invalid search query characters'
    });
  });
});
