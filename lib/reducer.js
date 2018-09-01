'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _actions = require('./actions');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
state = {
  'some form name': {
    fields: {
      ....
    },
    submitting: bool,
    submitFailed: bool,
    errors: Object / undefined,
  },
  'another form name': {....}
}
*/
function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      _action$meta = action.meta,
      meta = _action$meta === undefined ? {} : _action$meta,
      _action$error = action.error,
      error = _action$error === undefined ? false : _action$error;
  var form = meta.form;


  switch (type) {
    case _actions.FORM_INIT:
      {
        var fields = payload.fields,
            initialValues = payload.initialValues;

        return _extends({}, state, _defineProperty({}, form, { fields: fields, initialValues: initialValues }));
      }
    case _actions.FORM_DESTROY:
      {
        var forms = meta.forms;

        var newState = {};
        Object.keys(state).forEach(function (k) {
          for (var i = 0; i < forms.length; i++) {
            if (forms[i] === k) {
              return;
            }
          }

          newState[k] = state[k];
        });

        return newState;
      }
    case _actions.FORM_CHANGE:
      {
        var _fields = payload.fields,
            _initialValues = payload.initialValues;

        var old = state[form] || {};
        var oldFields = old.fields || {};
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          fields: _extends({}, oldFields, _fields),
          initialValues: _initialValues || old.initialValues,
          errors: false
        })));
      }

    case _actions.FORM_SUBMIT:
      {
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          submitting: true
        })));
      }
    case _actions.FORM_STOP_SUBMIT:
      {
        var newFormState = _extends({}, state[form], {
          submitting: false
        });

        //support field error
        if (error) {
          var _payload$fields = payload.fields,
              _fields2 = _payload$fields === undefined ? [] : _payload$fields,
              errors = _objectWithoutProperties(payload, ['fields']);

          newFormState.errors = errors;

          _fields2.forEach(function (fe) {
            var fieldInfo = newFormState.fields[fe.field] || {};
            fieldInfo.errors = fieldInfo.errors || [];
            fieldInfo.errors = [].concat(_toConsumableArray(fieldInfo.errors), [fe]);
            newFormState.fields[fe.field] = fieldInfo;
          });
        }
        var _newState = _extends({}, state, _defineProperty({}, form, newFormState));

        // console.log(newState);

        return _newState;
      }
    case _actions.FORM_SUBMIT_FAILED:
      {
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          submitFailed: true
        })));
      }
    case _actions.FORM_SUBMIT_SUCCEEDED:
      {
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          submitFailed: false
        })));
      }
    case _actions.FORM_CLEAR_SUBMIT_ERRORS:
      {
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          submitFailed: false,
          errors: false
        })));
      }
    default:
      return state;
  }
}