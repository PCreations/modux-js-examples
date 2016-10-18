import React from 'react'
import { connect } from 'react-redux'
import moduxFactory from 'modux-js'

const types = {
  INCREMENT: 'modux-js-example-counter/INCREMENT'
}

const getCounterSpecifications = () => ({
  actions: {
    increment(amount) {
      return {
        type: types.INCREMENT,
        payload: { amount }
      }
    }
  },
  selectors: {
    getValue(state) {
      return state.value
    }
  },
  initReducer(initialState = { value: 0 }) {  // initReducer receives the initialState potentially provided when instanciated this modux from inside your app
    const reducer = (state = initialState, action = {}) => {
      if (action.type === types.INCREMENT) {
        return {
          ...state,
          value: state.value += action.payload.amount
        }
      }
      return state
    }
    return reducer
  },
  initView({ selectors, actions }) {  // initView receives scoped selectors and actions as arguments. They are automatically scoped to wherever this modux as been mounted inside your app
    const Counter = ({ value }) => (
      <p>{`counter value : ${value}`}</p>
    )

    const CounterContainer = connect(
      state => ({
        value: selectors.getValue(state)
      })
    )(Counter)

    return CounterContainer
  }
})

export default moduxFactory(getCounterSpecifications)
