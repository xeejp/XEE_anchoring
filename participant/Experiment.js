import React, { Component } from 'react'
import { connect } from 'react-redux'

import Slider from 'material-ui/Slider'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import { Card, CardText } from 'material-ui/Card'

import { answer } from './actions'

const mapStateToProps = ({ sequence, qswap, question_text, sdef }) => ({
  sequence, question_text, sdef
})

class Experiment extends Component {
  constructor(props) {
    super(props)
    const { sdef } = this.props
    this.state = { value: sdef }
  }

  handleChange(event, value){
    this.setState({ value: value })
  }

 submit() {
    const{ dispatch } = this.props
    dispatch(answer(this.state.value))
  }
  
  add(num){
    this.setState({
      value: this.state.value + num
    })
  }

  render() {
    const { sequence, question_text } = this.props
    const Question = question_text["question"]
    const Text = question_text[sequence]
    return (sequence != "answered")?
    <Card><CardText>
      <div style={{height: 'auto'}}>
        <div style={{marginBottom: "5%"}}>{Question.split('\n').map( line => <h5>{line}</h5>)}</div>
        <div
          style={{
            display: "inline-block",
            padding: "0%",
            position: "relative",
            left: (this.state.value - question_text["min"]) * 100 / (question_text["max"] - question_text["min"]) + "%",
            transform: "translate(-50%, 0%)",
            width: "auto",
          }}
        >
          <Chip
            style={{
              display: "inline-block"
            }}
            onTouchTap={this.add.bind(this, -1)}
          >{"<"}</Chip>
          <Chip
            style={{
              display: "inline-block"
            }}
            >{this.state.value}</Chip>
          <Chip
            style={{
              display: "inline-block"
            }}
            onTouchTap={this.add.bind(this, 1)}
          >{">"}</Chip>
        </div>
        <Slider
          min={question_text.min}
          max={question_text.max}
          step={question_text.step}
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          sliderStyle={{  marginTop: "1%", marginBottom: "1%",}}
        />
        <RaisedButton label={"送信"} onClick={this.submit.bind(this)} primary={true} style={{marginTop: "5%"}} />
      </div>
      </CardText></Card>
    : <div><Card><CardText><p>{Text}</p></CardText></Card></div>
  }
}

export default connect(mapStateToProps)(Experiment)
