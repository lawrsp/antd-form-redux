# Connect antd Form to redux


## Install

```
npm install antd-form-redux --save
```

## Usage
Connect antd Form to redux use "reduxForm" HOC.
If you are familiar with redux-form, you will find it very the same.
If you are new to Form and redux, it is also very simple since it just use one API.

You just need 2 steps:

### Step-1. add reducer to your reducers

```javascript
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'antd-form-redux';

//import other reducers
const rootReducer = combineReducers({
  ...reducers,
  form: formReducer,
});

```

### Step-2. Use reduxForm(config) to connect component
```javascript
import { reduxForm } from 'antd-form-redux';

class NormalAntdForm extend Compoent {
  // ...
  render() {
    // ...
    const { test } = this.props;
    const { getFieldDecorator } = this.props.form;
    // use antd's pattern :
    // getFieldDecorator('fileds', .....)
    // ...
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

#### form : String [required]
#### Object<String, String> [optional]
#### enableReinitialize : boolean [optional]
#### keepDirtyOnReinitialize : boolean [optional]
#### destroyOnUnmount : boolean [optional]
#### forceUnregisterOnUnmount : boolean [optional]
#### getFormState : Function [optional]
#### onChange : Function [optional]
- values : Object
- dispatch : Function
- props : Object
- previousValues : Object
#### immutableProps : Array<String> [optional]
#### onSubmitFail : Function
- errors : Object
- dispatch : Function
- submitError : Error
- props : Object
#### onSubmitSuccess : Function [optional]
- result : Object
- dispatch : Function
- props : Object
#### onSubmit : Function
- values : Object
- dispatch : Function
- props : Object


## Action creators

There is also supplied redux-form likes action creators:

#### initialize(form, data)
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

## Props
The props listed here are the props that generated to give to your decorated form component.

### reset : Function
reset the form values to initialValues

### initialize : Function(values)
initialize the form values to values

## Example

this is a example according to antd docs:

```javascript
import React, {Component} from 'react'
import { reduxForm } from 'antd-form-redux';
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

