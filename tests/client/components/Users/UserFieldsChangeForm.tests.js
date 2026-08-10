import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import fakeStore from '../../../utils/fakeStore';
import UserFieldsChangeForm from '../../../../client/components/Users/UserFieldsChangeForm';

describe('#Client-Components-UserFieldsChangeForm', () => {
  const renderComponent = (languageDictionary, customFields) => {
    const fields = customFields || [{property: 'someField', edit: true}];
    return render(
      <Provider store={fakeStore({})}>
        <UserFieldsChangeForm
          onClose={()=>'onClose'}
          handleSubmit={()=>'handleSubmit'}
          submitting={false}
          languageDictionary={languageDictionary}
          customFields={fields}
        />
      </Provider>
    );
  };

  beforeEach(() => {
  });

  const checkButtons = (queries, cancel, update) => {
    expect(queries.getByRole('button', { name: cancel })).to.exist;
    expect(queries.getByRole('button', { name: update })).to.exist;
  };

  it('should render', () => {
    const queries = renderComponent();
    checkButtons(queries, 'Cancel', 'Update');
  });

  it('should render based on languageDictionary', () => {
    const languageDictionary = {
      cancelButtonText: 'CancelButton',
      updateButtonText: 'UpdateButton'
    };

    const queries = renderComponent(languageDictionary);
    checkButtons(queries, 'CancelButton', 'UpdateButton');
  });

  it('should render based on languageDictionary but missing button labels', () => {
    const languageDictionary = {
      someOtherKey: 'Some other value'
    };

    const queries = renderComponent(languageDictionary);
    checkButtons(queries, 'Cancel', 'Update');
  });

  it('should not render if there are no custom fields', () => {
    const { container } = renderComponent({}, []);
    expect(container.firstChild).to.not.exist;
  });

  it('should not render if the custom fields dont edit', () => {
    const { container } = renderComponent({}, [ { property: 'do.not.edit.me', edit: false }, { property: 'do.not.edit.me.either' } ]);
    expect(container.firstChild).to.not.exist;
  });

  it('should not render reserved fields', () => {
    const { container } = renderComponent({}, [ { property: 'password' } ]);
    expect(container.firstChild).to.not.exist;
  });

});
