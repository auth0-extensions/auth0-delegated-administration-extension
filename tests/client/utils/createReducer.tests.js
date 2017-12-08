import { expect } from 'chai';
import { fromJS } from 'immutable';

import createReducer from '../../../client/utils/createReducer';

const initialState = {
  someKey: 'someValue'
};

const SOME_BAD_TYPE = 'SOME_BAD_TYPE';
const SOME_GOOD_TYPE = 'SOME_GOOD_TYPE';

describe('createReducer', () => {
  const reducer = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
    [SOME_BAD_TYPE]: () => { 'someNonStatic' },
    [SOME_GOOD_TYPE]: (state) => state.merge({...initialState, newKey: 'newValue' }),
  });

  it('bad type', () => {
    expect(reducer.bind(reducer, initialState, { type: SOME_BAD_TYPE }))
      .to.throw(TypeError, 'Reducers must return Immutable objects.');
  });

  it('good type', () => {
    expect(
      reducer(initialState, {
        type: SOME_GOOD_TYPE
      }).toJSON()
    ).to.deep.equal({
      someKey: 'someValue',
      newKey: 'newValue'
    });
  });
});