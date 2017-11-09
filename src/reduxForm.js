import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { initialize, destroy, change } from './actions';

import hoistNonReactStatic from 'hoist-non-react-statics';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';

//config:
//form: String,  name of the form
//initialValues: Object,  initial value of the form
const reduxForm = config => CompNode => {
  class Wrapped extends Component {
    componentWillMount() {
      this.props.dispatch(initialize(config.form, config.initialValues));
    }
    componentWillUnmount() {
      this.props.dispatch(destroy(config.form));
    }
    render() {
      return <CompNode {...this.props} />;
    }
  }

  Wrapped.displayName = `withForm(${getDisplayName(CompNode)})`;
  hoistNonReactStatic(Wrapped, CompNode);

  return connect(({ form }) => {
    const formState = form[config.form] || {};
    const { fields = {}, ...others } = formState;
    return { [config.form]: others, formFields: fields };
  })(
    Form.create({
      onFieldsChange(props, changedFields) {
        props.dispatch(change(config.form, changedFields));
      },
      mapPropsToFields(props) {
        return props.formFields;
      },
      onValuesChange(_, values) {
        console.log(values);
      }
    })(Wrapped)
  );
};

export default reduxForm;

