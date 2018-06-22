import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { initialize, destroy, change } from './actions';
import invariant from 'invariant';

import hoistNonReactStatic from 'hoist-non-react-statics';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';

//config:
//form: String,  name of the form
//initialValues: Object,  initial value of the form
//initialValues : function
const reduxForm = ({ reducer = 'form', form, initialValues }) => CompNode => {
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
    render() {
      return <CompNode {...this.props} />;
    }
  }

  Wrapped.displayName = `withForm(${getDisplayName(CompNode)})`;
  hoistNonReactStatic(Wrapped, CompNode);

  function mapStateToProps(store) {
    const formAll = store[reducer];
    const formState = formAll[form] || {};
    const { fields = {}, ...others } = formState;

    return {
      [form]: others,
      formFields: fields
    };
  }

  return connect(mapStateToProps)(
    Form.create({
      onFieldsChange(props, changedFields) {
        props.dispatch(change(form, changedFields));
      },
      mapPropsToFields(props) {
        const { formFields = {} } = props;
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
