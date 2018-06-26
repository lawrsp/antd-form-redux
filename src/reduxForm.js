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
  validateFieldsKey = 'validateFields',
  initialValues
}) => CompNode => {
  invariant(
    form,
    '[antd-form-redux] - You must supply a nonempty string "form" to the component'
  );

  class wrappedComp extends Component {
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
      const { onSubmit = noop, onValidateError = noop } = this.props;
      this.props.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values);
          handleSubmit(values);
          return;
        }

        onValidateError(err);
      });
    };

    render() {
      const addedProps = {
        [validateFieldsKey]: this.props.form.validateFields
      };
      if (this.props.onSubmit) {
        addedProps.onSubmit = this.handleSubmit;
      }

      return <CompNode {...this.props} {...addedProps} />;
    }
  }

  wrappedComp.displayName = `withForm(${getDisplayName(CompNode)})`;
  hoistNonReactStatic(wrappedComp, CompNode);

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
    })(wrappedComp)
  );
};

export default reduxForm;
