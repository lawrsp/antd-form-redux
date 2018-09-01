# Use reduxForm() API for antd


## Install

```
npm install antd-form-redux
```

## Usage 
connect antd-form to redux use like redux-form's like "reduxForm" HOC. You just need 2 steps:

### Step-1. add reducer to your reducers
```
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'fantd-form-redux';

//import other reducers
const rootReducer = combineReducers({
  ...reducers,
  form: formReducer,
});

```

### Step-2. Use reduxForm(config) to connect component 
```
class NormalAntdForm extend Compoent {
  ...
  render() {
    ...
    const { test } = this.props;
    const { getFieldDecorator } = this.props.form;  
    // use antd's pattern :
    // getFieldDecorator('fileds', .....)
    ...
  }
}

export default reduxForm({
  form: 'test',  //the name of the form data store 
})(NormalAntdForm);

```

Note: you should also use the antd getFieldDecorator to do field bind and value check
there is no support like redux-form's Field or validate.

## Configure options:

This project make effort to use antd likes redux-form, these are supported configures now: 

#### form : String
#### initialValues : Object
#### enableReinitialize : Bool
#### keepDirtyOnReinitialize : Bool
#### updateUnregisteredFields : Bool
#### destroyOnUnmount : Bool
#### forceUnregisterOnUnmount : Bool
#### getFormState : Function(state) => formState
#### onChange : Function(values, dispatch, props, previousValues)
#### immutableProps : [String],
#### onSubmitFail : Function(errors, dispatch, submitError, props)
#### onSubmitSuccess : Function(result, dispatch, props)
#### onSubmit : Function(values, dispatch, props)


## Action creators

There is also supplied redux-form likes action creators:

#### initialize: (form, data) 
data : { fields, ....} 
use fields to set initialValues, you donnot use this action usually

#### destroy(...forms) 
delete the form data from store
you donnot use this action usually

#### change(form, fields) 
change the form fields values

#### startSubmit(form)
set submitting to true
#### stopSubmit(form, errors)
set submitting to false
#### setSubmitSucceeded(form)
set submitFailed to false
#### setSubmitFailed(form)
set submitFailed to true
#### clearSubmitErrors(form)
delete all errors

Note: 
if you want to get/set the submitting state, server validate errors to the form reducer, 
you would dispatch actions on your own, this is usually done in side effect handlers,
such as rudux-thunk, redux-promise, redux-saga, redux-observable, etc.

## Example

this is a example according to antd docs: 

```
import React, {Component} from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  render() {
    const {login} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="login-form-button"
            disabled={login.submitting}
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = reduxForm({
  form: 'login',  //the name of the form data store 
  onSubmit: function(values, dispatch, props) {
      //do with values, dispatch , props
      console.log('Received values of form: ', values);
  }
})(NormalLoginForm);

```

Note: you can also give onSubmit as props from parent Component.



