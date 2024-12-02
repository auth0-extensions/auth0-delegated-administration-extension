import expect from 'expect';
import { log } from '../../../client/reducers/log';
import * as constants from '../../../client/constants';
import {fromJS} from "immutable";

const initialState = {
  loading: false,
  error: null,
  logId: null,
  record: fromJS({})
};

describe('log reducer', () => {
  it('should return the initial state', () => {
    expect(
      log(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle CLEAR_LOG', () => {
    expect(
      log(initialState, {
        type: constants.CLEAR_LOG
      }).toJSON()
    ).toEqual(
      initialState
    );
  });


  it('should handle FETCH_LOG_PENDING', () => {
    expect(
      log(initialState, {
        type: constants.FETCH_LOG_PENDING,
        meta: {
          logId: 'log_id'
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        logId: 'log_id',
        record: fromJS({})
      }
    );
  });


  it('should handle FETCH_LOG_REJECTED', () => {
    expect(
      log(initialState, {
        type: constants.FETCH_LOG_REJECTED,
        errorData: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: {
          type: 'TEST',
          message: 'ERROR',
          status: 500
        },
        logId: null,
        record: fromJS({})
      }
    );
  });

  it('should handle FETCH_LOG_FULFILLED with invalid type', () => {
    expect(
      log({
        loading: false,
        error: null,
        logId: 'test_2',
        record: fromJS({})
      }, {
        type: constants.FETCH_LOG_FULFILLED,
        payload: {
          data: {
            log: {
              _id: 'test_2',
              type: 'custom_type'
            }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        logId: 'test_2',
        record: fromJS({
          _id: 'test_2',
          type: undefined,
          shortType: 'custom_type'
        })
      }
    );
  });

  it('should handle FETCH_LOG_FULFILLED with valid type', () => {
    expect(
      log({
        loading: false,
        error: null,
        logId: 'test_2',
        record: fromJS({})
      }, {
        type: constants.FETCH_LOG_FULFILLED,
        payload: {
          data: {
            log: {
              _id: 'test_2',
              type: 'seacft'
            }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        logId: 'test_2',
        record: fromJS({
          _id: 'test_2',
          type: 'Success Exchange',
          shortType: 'seacft'
        })
      }
    );
  });

  it('should handle FETCH_LOG_FULFILLED with valid type', () => {
    expect(
      log({
        loading: false,
        error: null,
        logId: 'test_2',
        record: fromJS({})
      }, {
        type: constants.FETCH_LOG_FULFILLED,
        payload: {
          data: {
            log: {
              _id: 'test_2',
              type: 'seacft'
            }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        logId: 'test_2',
        record: fromJS({
          _id: 'test_2',
          type: 'Success Exchange',
          shortType: 'seacft'
        })
      }
    );
  });

  it('should handle FETCH_LOG_FULFILLED state.log_id<>payload.log_id', () => {
    expect(
      log({
        loading: false,
        error: null,
        logId: 'test_1',
        record: fromJS({})
      }, {
        type: constants.FETCH_LOG_FULFILLED,
        payload: {
          data: {
            log: {
              _id: 'test_2',
              type: 'seacft'
            }
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        logId: 'test_1',
        record: fromJS({})
      }
    );
  });
});
