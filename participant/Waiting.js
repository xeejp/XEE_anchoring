import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardText, CardTitle } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'

const mapStateToProps = ({ joined, question_text }) => ({
  joined, question_text
})

const Waiting = ({ joined, question_text }) => (
	<Card>
		<CardTitle title="アンカリング" subtitle="待機画面" />
		<CardText>
			{question_text['waiting_text'].split('\n').map( line => <p>{line}</p>)}
		</CardText>
		<div style={{textAlign: "center"}}>
			<CircularProgress size={2}/>
		</div>
	</Card>
)

export default connect(mapStateToProps)(Waiting)
