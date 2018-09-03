import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';

class Signup extends Component {
  state = {  }
  render() {
    return (
      <form>
        <fieldset>
          <label htmlFor="">Email</label>
          <Field
            name='email'
            type='text'
            component='input'
          />
        </fieldset>
        <fieldset>
          <label htmlFor="">Password</label>
          <Field
            name='password'
            type='password'
            component='input'
          />
        </fieldset>
      </form>
    );
  }
}

export default reduxForm({ form: 'signup' })(Signup);
