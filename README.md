# Client Side Auth

## 1. First, initialize the project and install dependencies

```shell
# initialize react app
$ npx install create-react-app client

# install dependencies
$ npm install axios react react-dom react-redux react-router-dom react-scripts redux redux-form redux-thunk
```

## 2. Put all the route configuration to the index.js, which centralizes all our core setup logics for our application

Whenever the <App /> component is rendered, the <Route /> component will be passed to the <App /> as the prop, called children. And the <App /> component doesn't have to have the navigation logic

```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './components/App';
import Welcome from './components/Welcome';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Route path='/' exact component={Welcome} />
    </App>
  </BrowserRouter>,
  document.querySelector('#root')
);

// App.js
import React from 'react';

import Header from './Header';

const App = ({ children }) => {
  return (
    <div>
      <Header />
      { children }
    </div>
  );
}

export default App;
```

## 3. Wire up Redux for Redux Form

Add reducers and export to index.js

```javascript
// reducers/index.js
import { combineReducers } from 'redux';
import auth from './auth';

export default combineReducers({
  auth,
});

// reducers/auth.js
export default (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
}

// index.js
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import reducers from './reducers';

ReactDOM.render(
  <Provider store={createStore(reducers, {})}>
    ...
  </Provider>,
  document.querySelector('#root');
)
```

## 4. Setup Redux Form and wire up to Sign-Up form

```javascript
// reducer/index.js
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import auth from './auth';

export default combineReducers({
  auth,
  form: formReducers
});

// components/signup.js
import { reduxForm, Field } from 'redux-form';

class Signup extends Component {
  render() {
    return (
      <fieldset>
        <label>Email</label>
        <Field
          name='email'
          type='text'
          component='input'
        />
        ...
      </fieldset>
    )
  }
}

export default reduxForm({ form: 'signup' })(Signup);
```

## 5. Handling form submission

```javascript
// components/signup.js
class Signup extends Component {
  onSubmit = formProps => {
    // ...
  }
  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <button>Sign Up</button>
      </form>
    );
  }
}
```

What is Redux-Thunk?

A typical action creator is always to return an object that has properties of an type and a payload. And then this action get sent to the middleware and then reducers. Reducers then produce the new state and that flow back to our components.

So what is Redux-Thunk?

Rather than returning an object, we can return a function with the dispatch function parameter. It allow us to return an different value type from our action creators.

1. By having the ability to return a function with dispatch, we gain the ability to dispatch as many actions that we want from a single action creator.

2. In addition, we can handle asynchronous request.

## 6. Wire up Redux Thunk middleware

```javascript
// index.js
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDom.render(
  <Provider store={store}>
    ...
  </Provider>
);
```

## 7. Make Signup component a container or a connected component

First, add action creator and type

```javascript
// actions/types.js
export const AUTH_USER = 'auth_user';

// actions/auth.js
import axios from 'axios';
import { AUTH_USER } from './types';

/* Redux Thunk - returns a function with the dispatch function parameter */
export const signup = formProps => async dispatch => {
  const response = await axios.post('http://localhost:3090/signup', formProps);

  dispatch({
    type: AUTH_USER,
    payload: response.data.jwtToken,
  });
}
```

Second, make Signup component a connected component

```javascript
// use compose method to make syntax cleaner
import { compose } from 'redux';
import { connect } from 'react-redux';

class Signup extends Component {
  ...
}

export default compose(
  connect(null, actions),
  reduxForm({ form: 'signup' }),
)(Signup);
```

Last, deal with reducer for dispatched action

```javascript
import { AUTH_USER } from '../actions/types';

const INITIAL_STATE = {
  authenticated: '',
  errorMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      return { ...state, authenticated: action.payload };

    default:
      return state;
  }
}
```

## 8. Display auth errors

First in actions/auth.js, return an object with type of AUTH_ERROR and payload of errorMessage when fail to sign up.

```javascript
// actions/types.js
export const AUTH_USER = 'auth_user';
export const AUTH_ERROR = 'auth_error';

// actions/auth.js
import axios from 'axios';
import { AUTH_USER, AUTH_ERROR } from './types';

export const signup = formProps => async dispatch => {
  try {
    const response = await axios.post('http://localhost:3090', formProps);

    return {
      type: AUTH_USER,
      payload: response.data.jwtToken,
    };
  } catch (error) {
    return {
      type: AUTH_ERROR,
      payload: error.response.data.errorMessage,
    }
  }
};
```

Second, reducers

```javascript
import { AUTH_USER, AUTH_ERROR } from '../actions/types';

const INITIAL_STATE = {
  authenticated: '',
  errorMessage: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    ...
    case AUTH_ERROR:
      return { ...state, errorMessage: action.payload };
  }
}
```

Last, make Signup component be able to access application state

```javascript
class Signup extends Component {
  render() {
    return (
      ...
      <div>{this.props.errorMessage}</div>
      ...
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
)(Singup);
```
