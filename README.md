# antd-form-redux  for antd-3.0.0-rc

## Introduction
connect antd-form to redux
use like redux-form's "reduxForm" HOC


## Usage 
### 1. add reducer to your reducers
```
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'fantd-form-redux';

//import other reducers
const rootReducer = combineReducers({
  ...reducers,
  form: formReducer,
});

```

### 2. Use reduxForm(config) to connect component 
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
#### config:
##### form:  String 
the name of the form data stored 
##### formValuesKey: string
the key of the form values in props, default is form in config
##### formFieldsKey: string
the key of the form fields in props, default is 'formFields'

##### initialValues: [key: value] 
the initialValues

#### the form data 
default, you can get the form data represented by key named the form name
```
reduxForm({
  form: 'test',  
})(.....)

const { test } = this.props;

```
you also can specify a formValuesKey, so that you can get the data by it

```
reduxForm({
  form: 'test',  
  formValuesKey: "myFormValues"
})(.....)
const { myFormValues } = this.props;

```
some values often used:
```
myFormValues.submitting : Bool,
myFormValues.submitFaild : Bool,
myFormValues.errors : Object
```

the errors will be setted by dispatch a stopSubmit(form, errors) action


### 3. use action creators if you need:

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


## Example

this is a example from antd docs: 

```
import React, {Component} from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
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
})(NormalLoginForm);

```



