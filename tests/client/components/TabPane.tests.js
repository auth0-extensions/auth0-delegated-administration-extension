import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { MemoryRouter } from 'react-router-dom';

import TabPane from '../../../client/components/TabPane';

describe('#Client-Components-TabPane', () => {
  const renderComponent = (route, title, initialEntries = ['/']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <ul>
          <TabPane route={route} title={title} />
        </ul>
      </MemoryRouter>
    );

  it('should render the title and link to the route', () => {
    const { getByRole } = renderComponent('users', 'Users');

    const link = getByRole('link', { name: 'Users' });
    expect(link).to.have.attribute('href', '/users');
  });

  it('should mark the tab active when the route matches', () => {
    const { getByRole } = renderComponent('users', 'Users', ['/users']);

    expect(getByRole('link').closest('li')).to.have.class('active');
  });

  it('should mark the tab active for nested routes', () => {
    const { getByRole } = renderComponent('users', 'Users', ['/users/123']);

    expect(getByRole('link').closest('li')).to.have.class('active');
  });

  it('should not mark the tab active when the route does not match', () => {
    const { getByRole } = renderComponent('users', 'Users', ['/logs']);

    expect(getByRole('link').closest('li')).not.to.have.class('active');
  });
});
