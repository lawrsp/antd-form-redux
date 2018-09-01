"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getFieldsFromInitialValues = exports.getFieldsFromInitialValues = function getFieldsFromInitialValues(data) {
  return Object.keys(data).reduce(function (o, k) {
    return _extends({}, o, _defineProperty({}, k, { value: data[k], name: k }));
  }, {});
};