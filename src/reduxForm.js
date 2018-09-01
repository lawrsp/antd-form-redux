import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import hoistNonReactStatic from 'hoist-non-react-statics';
import Form from 'antd/lib/form';
import invariant from 'invariant';
import isEmpty from 'lodash/isEmpty';
import { initialize, destroy, change } from './actions';
import {
  getFieldsFromFlatValues,
  compareEqual,
  filterByDirtyFields,
  objectMap
} from './utils';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';
const noop = () => {};

//config:
//form: String,  name of the form
//initialValues: Object,  initial value of the form
//initialValues : function
const reduxForm = ({
  reducer = 'form',
  form,
  formValuesKey,
  initialValues = false,
  enableReinitialize = false,
  keepDirtyOnReinitialize = false,
  updateUnregisteredFields = false,
  destroyOnUnmount = true,
  forceUnregisterOnUnmount = true,
  getFormState = state => state.form, // function
  onChange = noop, // function(values, dispatch, props, previousValues)
  immutableProps = [],
  onSubmitFail = noop, // function(errors, dispatch, submitError, props)
  onSubmitSuccess = noop, // function(result, dispatch, props)
  onSubmit // function(values, dispatch, props)
}) => CompNode => {
  invariant(
    form,
    '[antd-form-redux] - You must supply a nonempty string "form" to the component'
  );

  class wrappedComp extends Component {
    componentDidMount() {
      const iv = initialValues || this.props.initialValues;
      if (iv) {
        this.props.dispatch(initialize(form, iv));
      }
    }

    componentWillUnmount() {
      if (destroyOnUnmount || forceUnregisterOnUnmount) {
        this.props.dispatch(destroy(form));
      }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      // enableReinitialize = false,
      // keepDirtyOnReinitialize = false,
      // immutableProps
      if (!enableReinitialize) {
        return;
      }
      //update
      const formState = this.props.formState;
      const lastInitialValues = formState.initialValues;
      const iv = this.props.initialValues;
      if (isEmpty(iv)) {
        return;
      }

      //
      if (iv === lastInitialValues) {
        return;
      }

      // compare
      if (!isEmpty(lastInitialValues)) {
        if (compareEqual(iv, lastInitialValues, immutableProps)) {
          return;
        }
      }

      let updateValues = iv;
      if (keepDirtyOnReinitialize) {
        updateValues = filterByDirtyFields(formState.fields)(updateValues);
      }

      if (isEmpty(updateValues)) {
        return;
      }

      // this.props.form.setFieldsValue(updateValues);
      const updateFields = getFieldsFromFlatValues(updateValues);
      this.props.dispatch(change(form, updateFields, iv));
    }

    handleInitialize = values => {
      this.props.dispatch(initialize(form, values));
    };

    handleSubmit = e => {
      e.preventDefault();
      const { dispatch, onValidateError = noop } = this.props;

      const theOnSubmit = this.props.onSubmit || noop;

      this.props.form.validateFields((err, values) => {
        if (err) {
          onSubmitFail(err, dispatch, err, this.props);
          onValidateError(err);
          return;
        }
        try {
          theOnSubmit(values, dispatch, this.props);
        } catch (err) {
          onSubmitFail(err, dispatch, err, this.props);
          return;
        }
        onSubmitSuccess(values, dispatch, this.props);
        return;
      });
    };

    handleReset = () => {
      const formState = this.props.formState;
      const iv = formState.initialValues || {};
      this.props.dispatch(initialize(form, iv));
    };

    render() {
      return (
        <CompNode
          {...this.props}
          onSubmit={this.handleSubmit}
          reset={this.handleReset}
          initialize={this.handleInitialize}
        />
      );
    }
  }

  wrappedComp.displayName = `withForm(${getDisplayName(CompNode)})`;
  hoistNonReactStatic(wrappedComp, CompNode);

  const getFormStateFormStore = store => {
    const state = getFormState(store);
    return state[form] || {};
  };

  function mapStateToProps(store, props) {
    return {
      formState: getFormStateFormStore(store),
      onSubmit: props.onSubmit || onSubmit
    };
  }

  const memorizeValuesChange = (props, changedValues, allValues) => {
    // function(values, dispatch, props, previousValues)
    const previousValues = memorizeValuesChange.lastValues;
    onChange(allValues, props.dispatch, props, previousValues);
    memorizeValuesChange.lastValues = allValues;
  };
  memorizeValuesChange.lastValues = {};

  return connect(mapStateToProps)(
    Form.create({
      onFieldsChange(props, changedFields) {
        props.dispatch(change(form, changedFields));
      },
      mapPropsToFields(props) {
        const { formState = {} } = props;
        const { fields = {} } = formState;
        const maps = objectMap(fields, v => Form.createFormField(v));
        return maps;
      },
      onValuesChange(props, values, allValues) {
        memorizeValuesChange(props, values, allValues);
      }
    })(wrappedComp)
  );
};

export default reduxForm;
