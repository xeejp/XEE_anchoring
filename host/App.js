import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchContents } from './actions'

import { calcResult } from './calcResult'

import Divider from 'material-ui/Divider'

import PageButtons from './PageButtons'
import EditQuestion from './EditQuestion'
import DownloadButton from './DownloadButton'
import Users from './Users'

import Chart from 'components/Chart'

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
    if (loading) {
      return <p>ロード中です。</p>
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
          <EditQuestion />
          <DownloadButton
            fileName={"anchoring.csv"}
            list={[
              ["アンカリングと修正"],
              ["実験日", new Date()],
              ["登録者数", Object.keys(participants).length],
              ["ID", "初期値", "回答"],
            ].concat(
              Object.keys(participants).map(id => [id, participants[id].sdef + question_text["unit"], (participants[id].answer != -1)? participants[id].answer + question_text["unit"] : "未回答"])
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