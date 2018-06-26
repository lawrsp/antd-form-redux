import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { initialize, destroy, change } from './actions';
import invariant from 'invariant';

import hoistNonReactStatic from 'hoist-non-react-statics';

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
  formFieldsKey = 'formFields',
  initialValues
}) => CompNode => {
  invariant(
    form,
    '[antd-form-redux] - You must supply a nonempty string "form" to the component'
  );

  class Wrapped extends Component {
    componentDidMount() {
      let iv = initialValues;
      if (typeof iv === 'function') {
        iv = initialValues(this.props);
      }
      this.props.dispatch(initialize(form, iv));
    }
    componentWillUnmount() {
      this.props.dispatch(destroy(form));
    }

    handleSubmit = e => {
      e.preventDefault();
      const { handleSubmit = noop, handleValidateError = noop } = this.props;
      this.props.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
          handleSubmit(values);
          return;
        }

        handleValidateError(err);
      });
    };
    render() {
      return <CompNode {...this.props} handleSubmit={this.handleSubmit} />;
    }
  }

  Wrapped.displayName = `withForm(${getDisplayName(CompNode)})`;
  hoistNonReactStatic(Wrapped, CompNode);

  function mapStateToProps(store) {
    const formAll = store[reducer];
    const formState = formAll[form] || {};
    const { fields = {}, ...others } = formState;

    const key = formValuesKey || form;

    return {
      [key]: others,
      [formFieldsKey]: fields
    };
  }

  return connect(mapStateToProps)(
    Form.create({
      onFieldsChange(props, changedFields) {
        props.dispatch(change(form, changedFields));
      },
      mapPropsToFields(props) {
        const formFields = props[formFieldsKey] || {};
        return Object.keys(formFields).reduce(
          (o, i) => ({
            ...o,
            [i]: Form.createFormField(formFields[i])
          }),
          {}
        );
      },
      onValuesChange(_, values) {
        console.log(values);
      }
    })(Wrapped)
  );
};

export default reduxForm;
