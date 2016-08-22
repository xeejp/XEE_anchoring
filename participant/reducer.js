import { combineReducers } from 'redux'

import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
    'change page': (_, { payload }) => ({ page: payload }),
    'joined': (_, { payload }) => ({ joined: payload }),
    'next question': (_, { payload }) => ( (payload.next == "question2")? { sequence: payload.next, question1: payload.selected } : {sequence: payload.next, question2: payload.selected}),
    'reset': (_, { payload }) => ( { sequence: payload.sequence, question1: payload.question1, question2: payload.question2, active: payload.active }),
    'result': (_, { payload: {rational, irational} }) => ({
      rational: rational, irational: irational }),
  }),
  handleAction('update contents', () => ({ loading: false }), { loading: true }),
])

export default reducer
