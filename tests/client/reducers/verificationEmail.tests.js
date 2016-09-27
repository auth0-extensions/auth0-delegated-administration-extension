import expect from 'expect';
import { verificationEmail } from '../../../client/reducers/verificationEmail';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  connection: null,
  userName: null
};

describe('Resend verification reducer', () => {
  it('should return the initial state', () => {
    expect(
      verificationEmail(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_RESEND_VERIFICATION_EMAIL', () => {
    expect(
      verificationEmail(initialState, {
        type: constants.REQUEST_RESEND_VERIFICATION_EMAIL,
        user: {
          user_id: 1,
          name: 'test_name',
          email: 'test@mail.ru'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        connection: 'connection',
        userName: 'test_name'
      }
    );
  });

  it('should handle REQUEST_RESEND_VERIFICATION_EMAIL', () => {
    expect(
      verificationEmail(initialState, {
        type: constants.REQUEST_RESEND_VERIFICATION_EMAIL,
        user: {
          user_id: 1,
          user_name: 'test_username',
          email: 'test@mail.ru'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        connection: 'connection',
        userName: 'test_username'
      }
    );
  });

  it('should handle REQUEST_RESEND_VERIFICATION_EMAIL', () => {
    expect(
      verificationEmail(initialState, {
        type: constants.REQUEST_RESEND_VERIFICATION_EMAIL,
        user: {
          user_id: 1,
          email: 'test@mail.ru'
        },
        connection: 'connection'
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        userId: 1,
        connection: 'connection',
        userName: 'test@mail.ru'
      }
    );
  });

  it('should handle CANCEL_RESEND_VERIFICATION_EMAIL', () => {
    expect(
      verificationEmail(initialState, {
        type: constants.CANCEL_RESEND_VERIFICATION_EMAIL
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle RESEND_VERIFICATION_EMAIL_PENDING', () => {
    expect(
      verificationEmail(initialState, {
        type: constants.RESEND_VERIFICATION_EMAIL_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        userId: null,
        connection: null,
        userName: null
      }
    );
  });

  it('should handle RESEND_VERIFICATION_EMAIL_REJECTED', () => {
    expect(
      verificationEmail(initialState, {
        type: constants.RESEND_VERIFICATION_EMAIL_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occured while sending email: ERROR',
        loading: false,
        requesting: false,
        userId: null,
        connection: null,
        userName: null
      }
    );
  });

  it('should handle RESEND_VERIFICATION_EMAIL_FULFILLED', () => {
    expect(
      verificationEmail(initialState, {
        type: constants.RESEND_VERIFICATION_EMAIL_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
