import { combineReducers } from 'redux'

import concatenateReducers from 'redux-concatenate-reducers'
import { handleAction, handleActions } from 'redux-actions'

const reducer = concatenateReducers([
  handleActions({
    'update contents': (_, { payload }) => payload,
    'change page': (_, { payload }) => ({ page: payload }),
    'joined': (_, { payload }) => ({ joined: payload }),
    'answered': (_, { payload: { sequence, answer } }) => ({ sequence: sequence, answer: answer }),
    'reset': (_, { payload }) => ( { sequence: payload.sequence,  question: payload.question, active: payload.active, question_text: payload.question_text, answer: payload.answer, sdef: payload.sdef }),
    'result': (_, { payload }) => ({ result: payload }),
    'qupdate': (_, { payload }) => ({ question_text: payload }),
  }),
  handleAction('update contents', () => ({ loading: false }), { loading: true }),
])

export default reducer