'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _form = require('antd/lib/form');

var _form2 = _interopRequireDefault(_form);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _actions = require('./actions');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      _ref$initialValues = _ref.initialValues,
      initialValues = _ref$initialValues === undefined ? false : _ref$initialValues,
      _ref$enableReinitiali = _ref.enableReinitialize,
      enableReinitialize = _ref$enableReinitiali === undefined ? false : _ref$enableReinitiali,
      _ref$keepDirtyOnReini = _ref.keepDirtyOnReinitialize,
      keepDirtyOnReinitialize = _ref$keepDirtyOnReini === undefined ? false : _ref$keepDirtyOnReini,
      _ref$updateUnregister = _ref.updateUnregisteredFields,
      updateUnregisteredFields = _ref$updateUnregister === undefined ? false : _ref$updateUnregister,
      _ref$destroyOnUnmount = _ref.destroyOnUnmount,
      destroyOnUnmount = _ref$destroyOnUnmount === undefined ? true : _ref$destroyOnUnmount,
      _ref$forceUnregisterO = _ref.forceUnregisterOnUnmount,
      forceUnregisterOnUnmount = _ref$forceUnregisterO === undefined ? true : _ref$forceUnregisterO,
      _ref$getFormState = _ref.getFormState,
      getFormState = _ref$getFormState === undefined ? function (state) {
    return state.form;
  } : _ref$getFormState,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === undefined ? noop : _ref$onChange,
      _ref$immutableProps = _ref.immutableProps,
      immutableProps = _ref$immutableProps === undefined ? [] : _ref$immutableProps,
      _ref$onSubmitFail = _ref.onSubmitFail,
      onSubmitFail = _ref$onSubmitFail === undefined ? noop : _ref$onSubmitFail,
      _ref$onSubmitSuccess = _ref.onSubmitSuccess,
      onSubmitSuccess = _ref$onSubmitSuccess === undefined ? noop : _ref$onSubmitSuccess,
      onSubmit = _ref.onSubmit;
  return function (CompNode) {
    (0, _invariant2.default)(form, '[antd-form-redux] - You must supply a nonempty string "form" to the component');

    var wrappedComp = function (_Component) {
      _inherits(wrappedComp, _Component);

      function wrappedComp() {
        var _ref2;

        var _temp, _this, _ret;

        _classCallCheck(this, wrappedComp);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = wrappedComp.__proto__ || Object.getPrototypeOf(wrappedComp)).call.apply(_ref2, [this].concat(args))), _this), _this.handleInitialize = function (values) {
          _this.props.dispatch((0, _actions.initialize)(form, values));
        }, _this.handleSubmit = function (e) {
          e.preventDefault();
          var _this$props = _this.props,
              dispatch = _this$props.dispatch,
              _this$props$onValidat = _this$props.onValidateError,
              onValidateError = _this$props$onValidat === undefined ? noop : _this$props$onValidat;


          var theOnSubmit = _this.props.onSubmit || noop;

          _this.props.form.validateFields(function (err, values) {
            if (err) {
              onSubmitFail(err, dispatch, err, _this.props);
              onValidateError(err);
              return;
            }
            try {
              theOnSubmit(values, dispatch, _this.props);
            } catch (err) {
              onSubmitFail(err, dispatch, err, _this.props);
              return;
            }
            onSubmitSuccess(values, dispatch, _this.props);
            return;
          });
        }, _this.handleReset = function () {
          var formState = _this.props.formState;
          var iv = formState.initialValues || {};
          _this.props.dispatch((0, _actions.initialize)(form, iv));
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(wrappedComp, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var iv = initialValues || this.props.initialValues;
          if (iv) {
            this.props.dispatch((0, _actions.initialize)(form, iv));
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (destroyOnUnmount || forceUnregisterOnUnmount) {
            this.props.dispatch((0, _actions.destroy)(form));
          }
        }
      }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState, snapshot) {
          // enableReinitialize = false,
          // keepDirtyOnReinitialize = false,
          // immutableProps
          if (!enableReinitialize) {
            return;
          }
          //update
          var formState = this.props.formState;
          var lastInitialValues = formState.initialValues;
          var iv = this.props.initialValues;
          if ((0, _isEmpty2.default)(iv)) {
            return;
          }

          //
          if (iv === lastInitialValues) {
            return;
          }

          // compare
          if (!(0, _isEmpty2.default)(lastInitialValues)) {
            if ((0, _utils.compareEqual)(iv, lastInitialValues, immutableProps)) {
              return;
            }
          }

          var updateValues = iv;
          if (keepDirtyOnReinitialize) {
            updateValues = (0, _utils.filterByDirtyFields)(formState.fields)(updateValues);
          }

          if ((0, _isEmpty2.default)(updateValues)) {
            return;
          }

          // this.props.form.setFieldsValue(updateValues);
          var updateFields = (0, _utils.getFieldsFromFlatValues)(updateValues);
          this.props.dispatch((0, _actions.change)(form, updateFields, iv));
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(CompNode, _extends({}, this.props, {
            onSubmit: this.handleSubmit,
            reset: this.handleReset,
            initialize: this.handleInitialize
          }));
        }
      }]);

      return wrappedComp;
    }(_react.Component);

    wrappedComp.displayName = 'withForm(' + getDisplayName(CompNode) + ')';
    (0, _hoistNonReactStatics2.default)(wrappedComp, CompNode);

    var getFormStateFormStore = function getFormStateFormStore(store) {
      var state = getFormState(store);
      return state[form] || {};
    };

    function mapStateToProps(store, props) {
      return {
        formState: getFormStateFormStore(store),
        onSubmit: props.onSubmit || onSubmit
      };
    }

    var memorizeValuesChange = function memorizeValuesChange(props, changedValues, allValues) {
      // function(values, dispatch, props, previousValues)
      var previousValues = memorizeValuesChange.lastValues;
      onChange(allValues, props.dispatch, props, previousValues);
      memorizeValuesChange.lastValues = allValues;
    };
    memorizeValuesChange.lastValues = {};

    return (0, _reactRedux.connect)(mapStateToProps)(_form2.default.create({
      onFieldsChange: function onFieldsChange(props, changedFields) {
        props.dispatch((0, _actions.change)(form, changedFields));
      },
      mapPropsToFields: function mapPropsToFields(props) {
        var _props$formState = props.formState,
            formState = _props$formState === undefined ? {} : _props$formState;
        var _formState$fields = formState.fields,
            fields = _formState$fields === undefined ? {} : _formState$fields;

        var maps = (0, _utils.objectMap)(fields, function (v) {
          return _form2.default.createFormField(v);
        });
        return maps;
      },
      onValuesChange: function onValuesChange(props, values, allValues) {
        memorizeValuesChange(props, values, allValues);
      }
    })(wrappedComp));
  };
};

exports.default = reduxForm;