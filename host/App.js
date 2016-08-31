import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from './actions'

import { calcResult } from './calcResult'

import PageButtons from './PageButtons'
import EditQuestion from './EditQuestion'
import Information from './Information'
import Users from './Users'

import Chart from 'components/Chart'

const mapStateToProps = ({loading, participants}) => ({
  loading, participants
})

class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchContents())
  }

  render() {
    const { loading, participants } = this.props
    if (loading) {
      return <p>ロード中です。</p>
    } else {
      return (
        <div>
          <PageButtons />
          <Information />
          <Users /><br />
          <Chart data={calcResult(participants)} expanded={false} /><br />
          <EditQuestion />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps)(App)