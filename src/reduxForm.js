import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import hoistNonReactStatic from 'hoist-non-react-statics';
import Form from 'antd/lib/form';
import invariant from 'invariant';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import ObjectKeys from 'lodash/keys';
import { initialize, destroy, change } from './actions';
import { getFieldsFromInitialValues } from './selectors';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';
const noop = () => {};

const compareEqual = (a, b, imuutables = []) => {
  const keysA = ObjectKeys(a);
  const keysB = ObjectKeys(b);

  if (keysA.length != keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const k = keysA[i];
    const elmA = a[k];
    const elmB = b[k];

    if (imuutables.indexOf(k) >= 0) {
      if (elmA !== elmB) {
        return false;
      }
      continue;
    }

    if (typeof elmA === 'object') {
      if (!isEqual(elmA, elmB)) {
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

  const getFormStateFromStore = createSelector(
    getFormState,
    state => state[form] || {}
  );

  class wrappedComp extends Component {
    componentDidMount() {
      const iv = initialValues || this.props.initialValues;
      if (iv) {
        this.props.dispatch(initialize(form, initialValues));
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

      if (iv === lastInitialValues) {
        return;
      }

      if (compareEqual(iv, lastInitialValues, immutableProps)) {
        return;
      }

      const fields = formState.fields;
      let updateValues = iv;
      if (keepDirtyOnReinitialize) {
        ObjectKeys(fields).forEach(k => {
          const fd = fields[k];
          if (fd.dirty) {
            delete updateValues[k];
          }
        });
      }

      // const updateFields = getFieldsFromInitialValues(updateValues);
      this.props.form.setFieldsValue(updateValues);
      this.props.dispatch(change(form, {}, iv));
    }

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

    render() {
      return <CompNode {...this.props} onSubmit={this.handleSubmit} />;
    }
  }

  wrappedComp.displayName = `withForm(${getDisplayName(CompNode)})`;
  hoistNonReactStatic(wrappedComp, CompNode);

  function mapStateToProps(store, props) {
    return {
      formState: getFormStateFromStore(store, form),
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
        const maps = ObjectKeys(fields).reduce(
          (o, k) => ({
            ...o,
            [k]: Form.createFormField(fields[k])
          }),
          {}
        );

        return maps;
      },
      onValuesChange(props, values, allValues) {
        memorizeValuesChange(props, values, allValues);
      }
    })(wrappedComp)
  );
};

export default reduxForm;
