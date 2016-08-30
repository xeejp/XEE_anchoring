import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from './actions'

import Chart from 'components/Chart'

const mapStateToProps = ({ result }) => ({
  result
})

const Result = ({ result }) => (
  <div>
  <Chart data={result} expanded={true} />
  </div>
)

export default connect(mapStateToProps)(Result)