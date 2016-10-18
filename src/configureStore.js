import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { fork } from 'redux-saga/effects'
import createLogger from 'redux-logger'

import root from './root'
import DevTools from './DevTools'


export default function configureStore(initialState) {

    const store = createStore(
      root.reducer,
      initialState,
      compose(
        applyMiddleware(
          createLogger()
        ),
        DevTools.instrument()
      )
    )

    return store
}
