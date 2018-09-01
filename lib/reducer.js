'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _actions = require('./actions');

var _utils = require('./utils');

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

  // actions will create form data:

  switch (type) {
    case _actions.FORM_INIT:
      {
        var initialValues = payload.initialValues;

        var newFields = (0, _utils.getFieldsFromFlatValues)(initialValues);
        var fields = (0, _utils.mergeFields)(state.fields, newFields);
        return _extends({}, state, _defineProperty({}, form, { fields: fields, initialValues: initialValues }));
      }
  }

  // actions would not create form data:
  if (!state[form]) {
    return state;
  }

  switch (type) {
    case _actions.FORM_DESTROY:
      {
        var forms = meta.forms;

        var newState = _extends({}, state);

        for (var i = 0; i < forms.length; i++) {
          delete newState[forms[i]];
        }

        return newState;
      }
    case _actions.FORM_CHANGE:
      {
        var _fields = payload.fields,
            _initialValues = payload.initialValues;

        var old = state[form] || {};
        var oldFields = old.fields || {};
        var merged = (0, _utils.mergeFields)(oldFields, _fields);

        var nForm = _extends({}, state[form], {
          fields: merged,
          errors: false
        });

        if (_initialValues) {
          nForm.initialValues = _initialValues;
        }
        return _extends({}, state, _defineProperty({}, form, nForm));
      }

    case _actions.FORM_SUBMIT:
      {
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          submitting: true
        })));
      }
    case _actions.FORM_STOP_SUBMIT:
      {
        //support field error
        if (error) {
          var _payload$fields = payload.fields,
              _fields2 = _payload$fields === undefined ? [] : _payload$fields,
              errors = _objectWithoutProperties(payload, ['fields']);

          var nState = (0, _utils.mergeFormErrors)(state[form], _fields2, errors);
          nState.submitting = false;
          return _extends({}, state, _defineProperty({}, form, nState));
        }
        return _extends({}, state, _defineProperty({}, form, _extends({}, state[form], {
          submitting: false
        })));
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
        var formData = state[form];
        return _extends({}, state, _defineProperty({}, form, _extends({}, formData, {
          fields: (0, _utils.clearFieldsErrors)(formData.fields),
          submitFailed: false,
          errors: false
        })));
      }
    default:
      return state;
  }
}