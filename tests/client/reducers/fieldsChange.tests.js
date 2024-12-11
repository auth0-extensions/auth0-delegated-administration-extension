import expect from 'expect';
import { fieldsChange } from '../../../client/reducers/fieldsChange';
import * as constants from '../../../client/constants';
import {fromJS} from "immutable";

const initialState = {
  error: null,
  userId: null,
  record: null,
  loading: false,
  validationErrors: fromJS({})
};

describe('custom fields change reducer', () => {
  it('should return the initial state', () => {
    expect(
      fieldsChange(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_FIELDS_CHANGE', () => {
    expect(
      fieldsChange(initialState, {
        type: constants.REQUEST_FIELDS_CHANGE,
        payload: {
          user: {
            user_id: 'user_id_1',
            email: 'test@mail.ru'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        userId: 'user_id_1',
        record: {
          user_id: 'user_id_1',
          email: 'test@mail.ru'
        },
        loading: false,
        validationErrors: fromJS({})
      }
    );
  });

  it('should handle REQUEST_FIELDS_CHANGE', () => {
    expect(
      fieldsChange(initialState, {
        type: constants.REQUEST_FIELDS_CHANGE,
        payload: {
          user: {
            user_id: 'user_id_1',
            name: 'test',
            email: 'test@mail.ru'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        userId: 'user_id_1',
        record: {
          user_id: 'user_id_1',
          name: 'test',
          email: 'test@mail.ru'
        },
        loading: false,
        validationErrors: fromJS({})
      }
    );
  });

  it('should handle CANCEL_FIELDS_CHANGE', () => {
    expect(
      fieldsChange(initialState, {
        type: constants.CANCEL_FIELDS_CHANGE
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FIELDS_CHANGE_PENDING', () => {
    expect(
      fieldsChange(initialState, {
        type: constants.FIELDS_CHANGE_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        userId: null,
        record: null,
        loading: true,
        validationErrors: fromJS({})
      }
    );
  });

  it('should handle FIELDS_CHANGE_REJECTED', () => {
    expect(
      fieldsChange(initialState, {
        type: constants.FIELDS_CHANGE_REJECTED,
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        error: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        },
        userId: null,
        record: null,
        loading: false,
        validationErrors: fromJS({})
      }
    );
  });

  it('should handle FIELDS_CHANGE_FULFILLED', () => {
    expect(
      fieldsChange(initialState, {
        type: constants.FIELDS_CHANGE_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
