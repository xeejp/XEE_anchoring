import { createAction } from 'redux-actions'

export const fetchContents = createAction('fetch contents')
export const answer  = createAction('answer', (selected) => ( selected ))