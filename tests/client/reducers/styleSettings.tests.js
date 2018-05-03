import expect from 'expect';
import _ from 'lodash';
import { styleSettings } from '../../../client/reducers/styleSettings';
import * as constants from '../../../client/constants';

const initialState = {
  useAlt: false,
  path: ''
};

describe('styleSettings reducer', () => {
  it('should return the initial state', () => {
    expect(
      styleSettings(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle TOGGLE_STYLE_SETTINGS', () => {
    expect(
      styleSettings(initialState, {
        type: constants.TOGGLE_STYLE_SETTINGS,
        payload: {
          useAlt: false,
          path: 'path/to/some.css'
        }
      }).toJSON()
    ).toEqual(
      {
        useAlt: false,
        path: 'path/to/some.css'
      }
    );
  });
});
