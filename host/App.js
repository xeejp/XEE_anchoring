import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from './actions'

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
    var data = new Array()
    for(var i in participants){
      if(participants[i].sequence == "answer"){
        data.push([participants[i].sdef, participants[i].answer])
      }
    }
    if (loading) {
      return <p>ロード中です。</p>
    } else {
      return (
        <div>
          <PageButtons />
          <Information />
          <Users /><br />
          <Chart data={data} expanded={false} />
          <EditQuestion />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps)(App)