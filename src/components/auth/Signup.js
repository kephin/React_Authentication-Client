import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import * as actions from '../../actions';

class Signup extends Component {
  state = {  }

  onSubmit = formProps => {
    this.props.signup(formProps);
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
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
        <div>{this.props.errorMessage}</div>
        <button>Sign Up</button>
      </form>
    );
  }
}

const mapStateToProps = state => {
  const { auth } = state;

  return {
    errorMessage: auth.errorMessage,
  };
};

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' }),
)(Signup);
