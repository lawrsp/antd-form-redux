'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearSubmitErrors = exports.setSubmitFailed = exports.setSubmitSucceeded = exports.stopSubmit = exports.startSubmit = exports.change = exports.destroy = exports.initialize = exports.FORM_SUBMIT_SUCCEEDED = exports.FORM_SUBMIT_FAILED = exports.FORM_CLEAR_SUBMIT_ERRORS = exports.FORM_STOP_SUBMIT = exports.FORM_SUBMIT = exports.FORM_CHANGE = exports.FORM_DESTROY = exports.FORM_INIT = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _selectors = require('./selectors');

var prefix = '@antd-form-redux';
var FORM_INIT = exports.FORM_INIT = prefix + '/init';
var FORM_DESTROY = exports.FORM_DESTROY = prefix + '/destroy';
var FORM_CHANGE = exports.FORM_CHANGE = prefix + '/change';
var FORM_SUBMIT = exports.FORM_SUBMIT = prefix + '/submit';
var FORM_STOP_SUBMIT = exports.FORM_STOP_SUBMIT = prefix + '/stop_submit';
var FORM_CLEAR_SUBMIT_ERRORS = exports.FORM_CLEAR_SUBMIT_ERRORS = prefix + '/clear_submit_errors';
var FORM_SUBMIT_FAILED = exports.FORM_SUBMIT_FAILED = FORM_SUBMIT + '/fail';
var FORM_SUBMIT_SUCCEEDED = exports.FORM_SUBMIT_SUCCEEDED = FORM_SUBMIT + '/success';

var initialize = exports.initialize = function initialize(form, data) {
  var action = {
    type: FORM_INIT,
    meta: { form: form },
    payload: {}
  };

  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    action.payload.fields = (0, _selectors.getFieldsFromInitialValues)(data);
    action.payload.initialValues = data;
  }

  return action;
};

var destroy = exports.destroy = function destroy() {
  for (var _len = arguments.length, forms = Array(_len), _key = 0; _key < _len; _key++) {
    forms[_key] = arguments[_key];
  }

  return {
    type: FORM_DESTROY,
    meta: { forms: forms }
  };
};

var change = exports.change = function change(form, fields, initialValues) {
  return {
    type: FORM_CHANGE,
    meta: { form: form },
    payload: {
      fields: fields,
      initialValues: initialValues
    }
  };
};
var startSubmit = exports.startSubmit = function startSubmit(form) {
  return { type: FORM_SUBMIT, meta: { form: form } };
};
var stopSubmit = exports.stopSubmit = function stopSubmit(form, err) {
  return {
    type: FORM_STOP_SUBMIT,
    meta: { form: form },
    payload: err,
    error: !!err
  };
};

var setSubmitSucceeded = exports.setSubmitSucceeded = function setSubmitSucceeded(form) {
  return {
    type: FORM_SUBMIT_SUCCEEDED,
    meta: { form: form }
  };
};

var setSubmitFailed = exports.setSubmitFailed = function setSubmitFailed(form) {
  return {
    type: FORM_SUBMIT_FAILED,
    meta: { form: form },
    error: true
  };
};

var clearSubmitErrors = exports.clearSubmitErrors = function clearSubmitErrors(form) {
  return {
    type: FORM_CLEAR_SUBMIT_ERRORS,
    meta: { form: form }
  };
};