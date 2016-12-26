import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from './actions'

import { calcResult } from './calcResult'

import Divider from 'material-ui/Divider'

import PageButtons from './PageButtons'
import Config from './Config'
import EditQuestion from './EditQuestion'
import DownloadButton from './DownloadButton'
import Users from './Users'

import Chart from 'components/Chart'

import { ReadJSON } from '../util/ReadJSON'

const mapStateToProps = ({loading, participants, question_text, page}) => ({
  loading, participants, question_text, page
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
    const { loading, participants, question_text, page } = this.props
    const text = ReadJSON().static_text
    if (loading) {
      return <p>{text["loading"]}</p>
    } else {
      return (
        <div>
          <PageButtons />
          <Divider
            style={{
              marginTop: "5%",
              marginBottom: "5%"
            }}
          />
          <Users /><br />
          <Chart data={calcResult(participants)} expanded={false} /><br />
          <Config />
          <EditQuestion />
          <DownloadButton
            fileName={"anchoring.csv"}
            list={[
              [text["title"]],
              [text["app"]["date"], new Date()],
              [text["app"]["people"], Object.keys(participants).length],
              [text["app"]["id"], text["app"]["init_value"], text["app"]["answer"]],
            ].concat(
              Object.keys(participants).map(id => [id, participants[id].sdef + question_text["unit"], (participants[id].answer != -1)? participants[id].answer + question_text["unit"] : text["app"]["no_answer"]])
            )}
            disabled={page != "result"}
            style={{marginLeft: '2%'}}
          />
        </div>
      )
    }
  }
}

export default connect(mapStateToProps)(App)
