import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'antd';
import { initialize, destroy, change } from './actions';

import hoistNonReactStatic from 'hoist-non-react-statics';

const getDisplayName = Comp => Comp.displayName || Comp.name || 'Component';

//config:
//form: String,  name of the form
//initialValues: Object,  initial value of the form
//initialValues : function
const reduxForm = (config, parentMapStateToProps, ...rest) => CompNode => {
  class Wrapped extends Component {
    componentDidMount() {
      var initialValues = config.initialValues;
      if (typeof initialValues === 'function') {
        initialValues = config.initialValues(this.props);
      }
      this.props.dispatch(initialize(config.form, initialValues));
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

  function mapStateToProps(store, ownProps) {
    const { form } = store;
    const formState = form[config.form] || {};
    const { fields = {}, ...others } = formState;

    if (parentMapStateToProps) {
      return {
        ...parentMapStateToProps(store, ownProps),
        [config.form]: others,
        formFields: fields
      };
    }

    return {
      [config.form]: others,
      formFields: fields
    };
  }

  return connect(mapStateToProps, ...rest)(
    Form.create({
      onFieldsChange(props, changedFields) {
        props.dispatch(change(config.form, changedFields));
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
