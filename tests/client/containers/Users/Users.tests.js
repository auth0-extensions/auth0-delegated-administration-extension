import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { fromJS } from 'immutable';

// import { fakeStore } from '../../../utils/fakeStore';

// import UsersContainer from '../../../../client/containers/Users/Users';
import UserHeader from '../../../../client/components/Users/UserHeader';

describe('#UserHeader', () => {
  const choiceText = 'Choice 1';
  // const saveSelection = jasmine.createSpy('saveSelection');
  let Component;
  let error = null;
  let loading = false;
  const languageDictionary = {
    loginsCountLabel: 'Some Logins Count Label:'
  }


  beforeEach(() => {
    const user = {
      name: 'bill',
      email: 'bill@mostek.com'
    };

    Component = shallow(
      <UserHeader
        error={null}
        loading={false}
        user={fromJS(user)}
        userFields={[]}
        languageDictionary={languageDictionary}
      />
    );
  });

  it('should render', () => {
    expect(Component.length).to.be.greaterThan(0);
    expect(Component.find('span.lined-text').text()).to.equal(languageDictionary.loginsCountLabel);
  });
});

// describe('#UsersContainer', () => {
//   let UsersContainerInstance;
//   let UsersOverviewComponentInstance;
//
//   beforeEach(() => {
//     const store = fakeStore({});
//
//     const wrapper = mount(
//       <Provider store={store}>
//         <UsersContainer />
//       </Provider>
//   );
//
//     UsersContainerInstance = wrapper.find(UsersContainer);
//     UsersOverviewComponentInstance = UsersContainerInstance.find(UsersOverview);
//   });
//
//   it('should render', () => {
//     expect(UsersContainerInstance.length).to.be.true;
//     expect(UsersOverviewComponentInstance.length).to.be.true;
//   });
// });
