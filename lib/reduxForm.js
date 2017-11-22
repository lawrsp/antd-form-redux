"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _antd = require("antd");

var _actions = require("./actions");

var _hoistNonReactStatics = require("hoist-non-react-statics");

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || "Component";
};

//config:
//form: String,  name of the form
//initialValues: Object,  initial value of the form
var reduxForm = function reduxForm(config) {
  return function (CompNode) {
    var Wrapped = function (_Component) {
      _inherits(Wrapped, _Component);

      function Wrapped() {
        _classCallCheck(this, Wrapped);

        return _possibleConstructorReturn(this, (Wrapped.__proto__ || Object.getPrototypeOf(Wrapped)).apply(this, arguments));
      }

      _createClass(Wrapped, [{
        key: "componentWillMount",
        value: function componentWillMount() {
          this.props.dispatch((0, _actions.initialize)(config.form, config.initialValues));
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.props.dispatch((0, _actions.destroy)(config.form));
        }
      }, {
        key: "render",
        value: function render() {
          return _react2.default.createElement(CompNode, this.props);
        }
      }]);

      return Wrapped;
    }(_react.Component);

    Wrapped.displayName = "withForm(" + getDisplayName(CompNode) + ")";
    (0, _hoistNonReactStatics2.default)(Wrapped, CompNode);

    return (0, _reactRedux.connect)(function (_ref) {
      var _ref2;

      var form = _ref.form;

      var formState = form[config.form] || {};

      var _formState$fields = formState.fields,
          fields = _formState$fields === undefined ? {} : _formState$fields,
          others = _objectWithoutProperties(formState, ["fields"]);

      return _ref2 = {}, _defineProperty(_ref2, config.form, others), _defineProperty(_ref2, "formFields", fields), _ref2;
    })(_antd.Form.create({
      onFieldsChange: function onFieldsChange(props, changedFields) {
        props.dispatch((0, _actions.change)(config.form, changedFields));
      },
      mapPropsToFields: function mapPropsToFields(props) {
        var _props$formFields = props.formFields,
            formFields = _props$formFields === undefined ? {} : _props$formFields;

        return Object.keys(formFields).reduce(function (o, i) {
          return _extends({}, o, _defineProperty({}, i, _antd.Form.createFormField(formFields[i])));
        }, {});
      },
      onValuesChange: function onValuesChange(_, values) {
        console.log(values);
      }
    })(Wrapped));
  };
};

exports.default = reduxForm;