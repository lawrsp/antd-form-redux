'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _antd = require('antd');

var _actions = require('./actions');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
};
var noop = function noop() {};
//config:
//form: String,  name of the form
//initialValues: Object,  initial value of the form
//initialValues : function
var reduxForm = function reduxForm(_ref) {
  var _ref$reducer = _ref.reducer,
      reducer = _ref$reducer === undefined ? 'form' : _ref$reducer,
      form = _ref.form,
      formValuesKey = _ref.formValuesKey,
      _ref$formFieldsKey = _ref.formFieldsKey,
      formFieldsKey = _ref$formFieldsKey === undefined ? 'formFields' : _ref$formFieldsKey,
      initialValues = _ref.initialValues;
  return function (CompNode) {
    (0, _invariant2.default)(form, '[antd-form-redux] - You must supply a nonempty string "form" to the component');

    var Wrapped = function (_Component) {
      _inherits(Wrapped, _Component);

      function Wrapped() {
        var _ref2;

        var _temp, _this, _ret;

        _classCallCheck(this, Wrapped);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Wrapped.__proto__ || Object.getPrototypeOf(Wrapped)).call.apply(_ref2, [this].concat(args))), _this), _this.handleSubmit = function (e) {
          e.preventDefault();
          var _this$props = _this.props,
              _this$props$handleSub = _this$props.handleSubmit,
              handleSubmit = _this$props$handleSub === undefined ? noop : _this$props$handleSub,
              _this$props$handleVal = _this$props.handleValidateError,
              handleValidateError = _this$props$handleVal === undefined ? noop : _this$props$handleVal;

          _this.props.form.validateFields(function (err, values) {
            if (!err) {
              // console.log('Received values of form: ', values);
              handleSubmit(values);
              return;
            }

            handleValidateError(err);
          });
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(Wrapped, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var iv = initialValues;
          if (typeof iv === 'function') {
            iv = initialValues(this.props);
          }
          this.props.dispatch((0, _actions.initialize)(form, iv));
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.props.dispatch((0, _actions.destroy)(form));
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(CompNode, _extends({}, this.props, { handleSubmit: this.handleSubmit }));
        }
      }]);

      return Wrapped;
    }(_react.Component);

    Wrapped.displayName = 'withForm(' + getDisplayName(CompNode) + ')';
    (0, _hoistNonReactStatics2.default)(Wrapped, CompNode);

    function mapStateToProps(store) {
      var _ref3;

      var formAll = store[reducer];
      var formState = formAll[form] || {};

      var _formState$fields = formState.fields,
          fields = _formState$fields === undefined ? {} : _formState$fields,
          others = _objectWithoutProperties(formState, ['fields']);

      var key = formValuesKey || form;

      return _ref3 = {}, _defineProperty(_ref3, key, others), _defineProperty(_ref3, formFieldsKey, fields), _ref3;
    }

    return (0, _reactRedux.connect)(mapStateToProps)(_antd.Form.create({
      onFieldsChange: function onFieldsChange(props, changedFields) {
        props.dispatch((0, _actions.change)(form, changedFields));
      },
      mapPropsToFields: function mapPropsToFields(props) {
        var formFields = props[formFieldsKey] || {};
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