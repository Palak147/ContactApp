/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import AppNavigator from './navigation/AppNavigator'

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import contactReducer from './store/reducers/contacts';

import { init } from './helper/db';

init().then(() => {
  console.log('Database created')
}).catch(err => {
  console.log('Database creation failed');
  console.log(err);
});
const rootReducer = combineReducers({
  contacts: contactReducer
})
const store = createStore(rootReducer,applyMiddleware(ReduxThunk));

const App: () => React$Node = () => {
  return <Provider store={store}><AppNavigator /></Provider>
};

export default App;
