'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearFieldsErrors = exports.filterByDirtyFields = exports.mergeFormErrors = exports.mergeFieldsErrors = exports.mergeFields = exports.compareFieldEqual = exports.compareEqual = exports.getFieldsFromFlatValues = exports.objectMap = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _omitBy = require('lodash/omitBy');

var _omitBy2 = _interopRequireDefault(_omitBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var objectMap = exports.objectMap = function objectMap() {
  var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fn = arguments[1];

  return (0, _mapValues2.default)(o, fn);
};

var getFieldsFromFlatValues = exports.getFieldsFromFlatValues = function getFieldsFromFlatValues(values) {
  return (0, _mapValues2.default)(values, function (value, name) {
    return { value: value, name: name };
  });
};

var compareEqual = exports.compareEqual = function compareEqual() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var imuutables = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var keysA = (0, _keys2.default)(a);
  var keysB = (0, _keys2.default)(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (var i = 0; i < keysA.length; i++) {
    var _k = keysA[i];
    var elmA = a[_k];
    var elmB = b[_k];

    if (imuutables.indexOf(_k) >= 0) {
      if (elmA !== elmB) {
        return false;
      }
      continue;
    }

    if ((typeof elmA === 'undefined' ? 'undefined' : _typeof(elmA)) === 'object') {
      if (!(0, _isEqual2.default)(elmA, elmB)) {
        return false;
      }
      continue;
    }

    if (elmA !== elmB) {
      return false;
    }
  }

  return true;
};

var compareFieldEqual = exports.compareFieldEqual = function compareFieldEqual(fa, fb) {
  if (fa === fb) {
    return true;
  }

  if (!fa || !fb) {
    return false;
  }

  return fa.value === fb.value;
};

var mergeFields = exports.mergeFields = function mergeFields() {
  var oldFields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var newFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if ((0, _isEmpty2.default)(newFields)) {
    return _extends({}, oldFields);
  }
  var merged = _extends({}, oldFields, newFields);
  (0, _keys2.default)(newFields).forEach(function (k) {
    if (merged[k].dirty) {
      return;
    }
    var of = oldFields[k];
    var nf = newFields[k];
    merged[k].dirty = compareFieldEqual(of, nf);
  });

  return merged;
};

// form.fields: { name: {name, values, error} }
// paylod.fields: [{field, messge}]
var mergeFieldsErrors = exports.mergeFieldsErrors = function mergeFieldsErrors() {
  var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var errFields = {};

  errors.forEach(function (err) {
    var k = err.field;
    var oldField = field[k] || {};
    var oldErrors = oldField.errors || [];
    errFields[k] = _extends({}, oldField, { errors: [].concat(_toConsumableArray(oldErrors), [fe]) });
  });

  return _extends({}, fields, errFields);
};

var mergeFormErrors = exports.mergeFormErrors = function mergeFormErrors() {
  var stateForm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fieldErrors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var errors = arguments[2];

  var fields = mergeFieldsErrors(stateForm.fields, fieldErrors);
  return _extends({}, stateForm, {
    fields: fields,
    errors: (0, _isEmpty2.default)(errors) ? false : errors
  });
};

var filterByDirtyFields = exports.filterByDirtyFields = function filterByDirtyFields(fields) {
  return function (values) {
    return (0, _omitBy2.default)(values, function (val, key) {
      var fd = fields[k];
      if (fd.dirty) {
        return true;
      }
      return false;
    });
  };
};

var clearFieldsErrors = function clearFieldsErrors() {
  var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _mapValues2.default)(function (value) {
    var _fd = fd,
        errors = _fd.errors,
        nFields = _objectWithoutProperties(_fd, ['errors']);

    return nFields || {};
  });
};
exports.clearFieldsErrors = clearFieldsErrors;