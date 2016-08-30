import { put, take, call, select, fork } from 'redux-saga/effects'

import { fetchContents, answer } from './actions'

function* fetchContentsSaga() {
  while (true) {
    yield take(`${fetchContents}`)
    yield call(sendData, 'fetch contents')
  }
}

function* answerSaga() {
  while(true){
    const {payload: selected} = yield take(`${answer}`)
    yield call(sendData, 'answer', selected)
  }
}

function* saga() {
  yield fork(fetchContentsSaga)
  yield fork(answerSaga)
}

export default saga
