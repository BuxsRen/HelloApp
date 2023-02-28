import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
// import {createLogger} from 'redux-logger';
import dialog from './modules/dialog';
import ws from './modules/ws';

const RootReducer = combineReducers({
  ws,
  dialog,
});

const store = createStore(
  RootReducer,
  //compose(applyMiddleware(createLogger())),
);

export default store;
