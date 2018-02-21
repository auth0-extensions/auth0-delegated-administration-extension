import expect from 'expect';
import { emailChange } from '../../../client/reducers/emailChange';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  connection: null
};

describe('email change reducer', () => {
  it('should return the initial state', () => {
    expect(
      emailChange(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_EMAIL_CHANGE', () => {
    expect(
      emailChange(initialState, {
        type: constants.REQUEST_EMAIL_CHANGE,
        user: {
          user_id: 'user_id_1',
          email: 'test@mail.ru'
        },
        connection: 'connections',
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_id_1',
          email: 'test@mail.ru'
        },
        connection: 'connections',
      }
    );
  });

  it('should handle REQUEST_EMAIL_CHANGE', () => {
    expect(
      emailChange(initialState, {
        type: constants.REQUEST_EMAIL_CHANGE,
        user: {
          user_id: 'user_id_1',
          name: 'test',
          email: 'test@mail.ru'
        },
        connection: 'connections'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_id_1',
          name: 'test',
          email: 'test@mail.ru'
        },
        connection: 'connections'
      }
    );
  });

  it('should handle REQUEST_EMAIL_CHANGE', () => {
    expect(
      emailChange(initialState, {
        type: constants.REQUEST_EMAIL_CHANGE,
        user: {
          user_id: 'user_id_1',
          user_name: 'test',
          email: 'test@mail.ru'
        },
        connection: 'connections'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        user: {
          user_id: 'user_id_1',
          user_name: 'test',
          email: 'test@mail.ru'
        },
        connection: 'connections'
      }
    );
  });

  it('should handle CANCEL_EMAIL_CHANGE', () => {
    expect(
      emailChange(initialState, {
        type: constants.CANCEL_EMAIL_CHANGE
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle EMAIL_CHANGE_PENDING', () => {
    expect(
      emailChange(initialState, {
        type: constants.EMAIL_CHANGE_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        user: null,
        connection: null
      }
    );
  });

  it('should handle EMAIL_CHANGE_REJECTED', () => {
    expect(
      emailChange(initialState, {
        type: constants.EMAIL_CHANGE_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: {
          message: 'ERROR',
          type: 'change_email'
        },
        requesting: false,
        user: null,
        connection: null
      }
    );
  });

  it('should handle EMAIL_CHANGE_FULFILLED', () => {
    expect(
      emailChange(initialState, {
        type: constants.EMAIL_CHANGE_FULFILLED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
