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
