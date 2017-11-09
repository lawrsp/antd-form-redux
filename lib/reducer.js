'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _actions = require('./actions');

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
        var fields = payload.fields;

        return _extends({}, state, _defineProperty({}, form, { fields: fields }));
      }
    case _actions.FORM_DESTROY:
      {
        var forms = meta.forms;

        var newState = {};
        Object.keys(state).forEach(function (k) {
          for (var i = 0; i < forms.length; i++) {
            if (forms[i] === k) {}
            return;
          }

          newState[k] = state[k];
        });

        return newState;
      }
    case _actions.FORM_CHANGE:
      {
        var _fields = payload.fields;

        var oldFields = (state[form] || {}).fields;
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          fields: _extends({}, oldFields, _fields),
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
        var errors = payload.errors;

        var _newState = _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          submitting: false
        })));

        if (error) {
          _newState[form].errors = errors;
        }

        console.log(_newState);

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