import expect from 'expect';
import _ from 'lodash';
import { settings } from '../../../client/reducers/settings';
import * as constants from '../../../client/constants';
import { fromJS } from 'immutable';

const initialState = {
  loading: false,
  error: null,
  record: fromJS({ settings: { dict: { title: '', memberships: '' }, userFields: [], css: '' } })
};

describe('settings reducer', () => {
  it('should return the initial state', () => {
    expect(
      settings(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_SETTINGS_PENDING', () => {
    expect(
      settings(initialState, {
        type: constants.FETCH_SETTINGS_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: fromJS({ settings: { dict: { title: '', memberships: '' }, userFields: [], css: '' } })
      }
    );
  });

  it('should handle FETCH_SETTINGS_REJECTED', () => {
    expect(
      settings(initialState, {
        type: constants.FETCH_SETTINGS_REJECTED,
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
        record: fromJS({ settings: { dict: { title: '', memberships: '' }, userFields: [], css: '' } })
      }
    );
  });

  describe('should handle FETCH_SETTINGS_FULFILLED', () => {
    let basicField = {
      label: 'Name',
      property: 'name',
      sortProperty: 'user_metadata.family_name',
      display: true,
      create: false,
      edit: false,
      search: {
        listOrder: 1,
        listSize: '20%',
        sort: true,
        filter: false
      }
    };

    let basicField2 = {
      label: 'Email',
      property: 'email',
      display: true,
      create: {
        type: 'text'
      },
      edit: {
        type: 'text'
      }
    };

    it('basic', () => {
      expect(
        settings(initialState, {
          type: constants.FETCH_SETTINGS_FULFILLED,
          payload: {
            data: {
              settings: {
                dict: { title: 'test', memberships: 'test1, test2' },
                css: 'style.css'
              }
            }
          }
        }).toJSON()
      ).toEqual(
        {
          loading: false,
          error: null,
          record: fromJS({
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              css: 'style.css'
            }
          })
        }
      );
    });

    it('userFields basic', () => {
      expect(
        settings(initialState, {
          type: constants.FETCH_SETTINGS_FULFILLED,
          payload: {
            data: {
              settings: {
                dict: { title: 'test', memberships: 'test1, test2' },
                userFields: [ basicField, basicField2 ],
                css: 'style.css'
              }
            }
          }
        }).toJSON()
      ).toEqual(
        {
          loading: false,
          error: null,
          record: fromJS({
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              userFields: [ basicField, basicField2 ],
              css: 'style.css'
            }
          })
        }
      );
    });

    it('userFields top level display', () => {
      let displayFunctionField = {
        label: 'Username',
        property: 'username',
        display: 'function(user) { return (user.username && user.username.length > 0) ? user.username : ""; }',
        create: {
          type: 'text'
        },
        edit: false,
        search: {
          listOrder: 2,
          listSize: '20%',
          sort: true,
          filter: false
        }
      };

      let displayFunctionFieldTarget = _.cloneDeep(displayFunctionField);
      let displayFunc = eval(`(${displayFunctionField.display})`);
      displayFunctionFieldTarget.display = displayFunc;
      displayFunctionFieldTarget.create.display = displayFunc;
      displayFunctionFieldTarget.search.display = displayFunc;

      expect(
        settings(initialState, {
          type: constants.FETCH_SETTINGS_FULFILLED,
          payload: {
            data: {
              settings: {
                dict: { title: 'test', memberships: 'test1, test2' },
                userFields: [ basicField, displayFunctionField ],
                css: 'style.css'
              }
            }
          }
        }).toJSON()
      ).toEqual(
        {
          loading: false,
          error: null,
          record: fromJS({
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              userFields: [ basicField, displayFunctionFieldTarget ],
              css: 'style.css'
            }
          })
        }
      );
    });

    it('userFields specific display', () => {
      let complexDisplayFunctionField = {
        label: 'Username',
        property: 'username',
        display: true,
        create: {
          display: 'function(user) { return (user.username && user.username.length > 0) ? user.username : ""; }',
          type: 'text'
        },
        edit: {
          type: 'text'
        },
        search: {
          listOrder: 2,
          listSize: '20%',
          sort: true,
          filter: false

        }
      };

      let complexDisplayFunctionFieldTarget = _.cloneDeep(complexDisplayFunctionField);
      let displayFunc2 = eval(`(${complexDisplayFunctionField.create.display})`);
      complexDisplayFunctionFieldTarget.create.display = displayFunc2;
      complexDisplayFunctionFieldTarget.search.display = true;
      complexDisplayFunctionFieldTarget.edit.display = true;

      expect(
        settings(initialState, {
          type: constants.FETCH_SETTINGS_FULFILLED,
          payload: {
            data: {
              settings: {
                dict: { title: 'test', memberships: 'test1, test2' },
                userFields: [ complexDisplayFunctionField, basicField ],
                css: 'style.css'
              }
            }
          }
        }).toJSON()
      ).toEqual(
        {
          loading: false,
          error: null,
          record: fromJS({
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              userFields: [ complexDisplayFunctionFieldTarget, basicField ],
              css: 'style.css'
            }
          })
        }
      );
    });

    it('userFields options', () => {
      let optionsField = {
        label: 'SomeOptionField',
        property: 'someOption',
        display: true,
        create: {
          options: [
            'someValue', { label: 'someLabel', value: 'someOtherValue' }, 'some3Value'
          ]
        },
        edit: {
          options: [
            'someValue', { label: 'someLabel', value: 'someOtherValue' }, 'some3Value'
          ]
        }
      };

      let optionsFieldTarget = _.cloneDeep(optionsField);
      let optionTarget = [
        { label: 'someValue', value: 'someValue' }, {
          label: 'someLabel',
          value: 'someOtherValue'
        }, { label: 'some3Value', value: 'some3Value' }
      ];
      optionsFieldTarget.create.options = optionTarget;
      optionsFieldTarget.create.display = true;
      optionsFieldTarget.edit.options = optionTarget;
      optionsFieldTarget.edit.display = true;

      expect(
        settings(initialState, {
          type: constants.FETCH_SETTINGS_FULFILLED,
          payload: {
            data: {
              settings: {
                dict: { title: 'test', memberships: 'test1, test2' },
                userFields: [ optionsField, basicField2 ],
                css: 'style.css'
              }
            }
          }
        }).toJSON()
      ).toEqual(
        {
          loading: false,
          error: null,
          record: fromJS({
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              userFields: [ optionsFieldTarget, basicField2 ],
              css: 'style.css'
            }
          })
        }
      );
    });

    it('userFields bad display function', () => {
      let field = {
        label: 'SomeField',
        property: 'someField',
        display: 'function some bad function'
      };

      let field2 = {
        label: 'SomeOtherField',
        property: 'someOtherField'
      };


      let fieldTarget = _.cloneDeep(field);
      fieldTarget.display = eval('(function() { return "error"; })');

      const state = settings(initialState, {
        type: constants.FETCH_SETTINGS_FULFILLED,
        payload: {
          data: {
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              userFields: [ field, field2 ],
              css: 'style.css'
            }
          }
        }
      }).toJSON();

      const target = {
        loading: false,
        error: null,
        record: fromJS({
          settings: {
            dict: { title: 'test', memberships: 'test1, test2' },
            userFields: [ fieldTarget, field2 ],
            css: 'style.css'
          }
        })
      };

      expect(
        JSON.stringify(state.record.toJS().settings.userFields[0].display)
      ).toEqual(
        JSON.stringify(target.record.toJS().settings.userFields[0].display)
      );

      expect(
        state
      ).toEqual(
        target
      );
    });

    it('userFields bad option', () => {
      let optionsField = {
        label: 'SomeOptionField',
        property: 'someOption',
        display: true,
        create: {
          options: [
            false, function () {}, 'value'
          ]
        },
        edit: {
          display: true,
          options: 'hello'
        }
      };

      let optionsFieldTarget = _.cloneDeep(optionsField);
      let optionTarget = [
        { label: 'Error', value: '' },  { label: 'Error', value: '' }, { label: 'value', value: 'value' }
      ];
      optionsFieldTarget.create.options = optionTarget;
      optionsFieldTarget.create.display = true;

      expect(
        settings(initialState, {
          type: constants.FETCH_SETTINGS_FULFILLED,
          payload: {
            data: {
              settings: {
                dict: { title: 'test', memberships: 'test1, test2' },
                userFields: [ optionsField, basicField2 ],
                css: 'style.css'
              }
            }
          }
        }).toJSON()
      ).toEqual(
        {
          loading: false,
          error: null,
          record: fromJS({
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              userFields: [ optionsFieldTarget, basicField2 ],
              css: 'style.css'
            }
          })
        }
      );

    });

    it('userFields good validate function', () => {
      let field = {
        label: 'SomeField',
        property: 'someField',
        edit: {
          validationFunction: 'function  (value) { return false; }'
        },
        create: {
          validationFunction: 'function  (value) { return "create"; }'
        }
      };

      let fieldTarget = _.cloneDeep(field);
      fieldTarget.edit.validationFunction = eval(`(${field.edit.validationFunction})`);
      fieldTarget.create.validationFunction = eval(`(${field.create.validationFunction})`);

      const state = settings(initialState, {
        type: constants.FETCH_SETTINGS_FULFILLED,
        payload: {
          data: {
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              userFields: [ field ],
              css: 'style.css'
            }
          }
        }
      }).toJSON();

      const target = {
        loading: false,
        error: null,
        record: fromJS({
          settings: {
            dict: { title: 'test', memberships: 'test1, test2' },
            userFields: [ fieldTarget ],
            css: 'style.css'
          }
        })
      };

      expect(
        state.record.toJS().settings.userFields[0].edit.validationFunction.toString()
      ).toEqual(
        target.record.toJS().settings.userFields[0].edit.validationFunction.toString()
      );

      expect(
        state.record.toJS().settings.userFields[0].create.validationFunction.toString()
      ).toEqual(
        target.record.toJS().settings.userFields[0].create.validationFunction.toString()
      );

      expect(
        state
      ).toEqual(
        target
      );
    });

    it('errorTranslator function', () => {
      let errorTranslator = (
        function (err) {
          return err.message || err;
        }
      ).toString();

      let targetTranslator = eval(`(${errorTranslator})`);

      const state = settings(initialState, {
        type: constants.FETCH_SETTINGS_FULFILLED,
        payload: {
          data: {
            settings: {
              dict: { title: 'test', memberships: 'test1, test2' },
              css: 'style.css',
              errorTranslator: errorTranslator
            }
          }
        }
      }).toJSON();

      const target = {
        loading: false,
        error: null,
        record: fromJS({
          settings: {
            dict: { title: 'test', memberships: 'test1, test2' },
            css: 'style.css',
            errorTranslator: targetTranslator
          }
        })
      };

      expect(
        state.record.toJS().settings.errorTranslator.toString()
      ).toEqual(
        targetTranslator.toString()
      );

      expect(
        state
      ).toEqual(
        target
      );
    });
  });
});
