import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import sagas from "./saga";
import reducer from "./reducer";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxStore = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(sagas);

export default reduxStore;
