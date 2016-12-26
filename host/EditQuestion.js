import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Tabs, Tab} from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'

import { updateQuestion, fetchContents } from './actions'

import { ReadJSON } from '../util/ReadJSON'

const mapStateToProps = ({ question_text, page }) => ({
  question_text, page
})

class EditQuestion extends Component {
  constructor(props){
    super(props)
    const { question_text } = this.props
    var default_text = question_text
    var static_text = ReadJSON().static_text
    if(!question_text) {
      default_text = ReadJSON().dynamic_text
      const { dispatch } = this.props
      dispatch(updateQuestion(default_text))
    }
    this.state = {
      question_text: default_text,
      static_text: static_text,
      open: false,
      snack: false,
      message: static_text["editquestion"]["send_message"],
      mainSlideIndex: 0,
      disabled: false,
      default_text: ReadJSON().dynamic_text
    }
  }

  QuestionTab(){
    return (
      <div style={{height: '100%', position: 'relative'}}>
        <TextField
         hintText={this.state.static_text["editquestion"]["question"]}
         defaultValue={this.state.question_text["question"]}
         onBlur={this.handleChange.bind(this, ["question"])}
         multiLine={true}
         fullWidth={true}
       /><br />
       <p>{this.state.static_text["editquestion"]["slider_setting"]}</p><br />
        <TextField
         hintText={this.state.static_text["editquestion"]["min"]}
         defaultValue={this.state.question_text["min"]}
         onChange={this.handleChangeOnlyNum.bind(this, ["min"])}
       /> {this.state.static_text["editquestion"]["from"]} <TextField
         hintText={this.state.static_text["editquestion"]["max"]}
         defaultValue={this.state.question_text["max"]}
         onChange={this.handleChangeOnlyNum.bind(this, ["max"])}
       /> {this.state.static_text["editquestion"]["to"]}<br />
       ({this.state.static_text["editquestion"]["unit1"]}<TextField
         hintText={this.state.static_text["editquestion"]["unit2"]}
         defaultValue={this.state.question_text["unit"]}
         onChange={this.handleChange.bind(this, ["unit"])}
       />)
      </div>
    )
  }

  WaitingTab() {
    return (
      <div style={{height: '100%', position: 'relative'}}>
        <TextField
         hintText={this.state.static_text["editquestion"]["waiting_text"]}
         defaultValue={this.state.question_text["waiting_text"]}
         onBlur={this.handleChange.bind(this, ["waiting_text"])}
         multiLine={true}
         fullWidth={true}
       />
      </div>
    )
  }

  handleOpen() {
    const { dispatch } = this.props
    dispatch(fetchContents())
    this.setState({
      open: true,
      question_text: this.props.question_text,
      mainSlideIndex: 0,
    })
  }

  handleClose() {
    this.setState({ open: false, disabled: false })
  }

  handleChange(value, event){
    var question_text = Object.assign({}, this.state.question_text)
    var temp = question_text
    for(var i = 0; i < value.length - 1; i++){
      temp = temp[value[i]]
    }
    temp[value[value.length - 1]] = event.target.value
    this.setState({ question_text: question_text })
  }

  handleChangeOnlyNum(value, event){
    if(isNaN(event.target.value) || event.target.value.indexOf('.') != -1) {
      this.setState({ disabled: true })
      return
    }
    var question_text = Object.assign({}, this.state.question_text)
    var temp1 = question_text
    for(var i = 0; i < value.length - 1; i++){
      temp1 = temp1[value[i]]
    }
    var temp2 = parseInt(temp1[value[value.length - 1]])
    temp1[value[value.length - 1]] = parseInt(event.target.value)
    this.setState({ question_text: question_text, disabled: false })
    if(parseInt(question_text.min) >= parseInt(question_text.max)){
      temp1[value[value.length - 1]] = temp2
      this.setState({ question_text: question_text, disabled: true })
    }
  }

  handleMainSlide(value){
    this.setState({
      mainSlideIndex: value
    })
  }

  handleRequestClose() {
    this.setState({ snack: false })
  }

  submit() {
    this.setState({
      open: false,
      snack: true,
      message: this.state.static_text["editquestion"]["send_message"]
    })
    const { dispatch } = this.props
    dispatch(updateQuestion(this.state.question_text))
  }

  reset(){
    this.setState({
      question_text: this.state.default_text,
      open: false,
      snack: true,
      message: this.state.static_text["editquestion"]["reset_message"],
      disabled: false,
    })
    const { dispatch } = this.props
    dispatch(updateQuestion(this.state.default_text))
  }

  render(){
    const { page } = this.props
    const actions = [
      <RaisedButton
        label={this.state.static_text["editquestion"]["apply"]}
        disabled={this.state.disabled}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.submit.bind(this)}
      />,
      <RaisedButton
        label={this.state.static_text["editquestion"]["cancel"]}
        onTouchTap={this.handleClose.bind(this)}
      />,
     <RaisedButton
        label={this.state.static_text["editquestion"]["reset"]}
        onTouchTap={this.reset.bind(this)}
      />,
    ]
    return (<span>
      <FloatingActionButton onClick={this.handleOpen.bind(this)} disabled={page != "waiting"} style={{ marginLeft: "2%" }}>
         <ImageEdit />
      </FloatingActionButton>
      <Dialog
        title={this.state.static_text["editquestion"]["editor"]}
        actions={actions}
        modal={false}
        open={this.state.open}
        autoScrollBodyContent={this.state.mainSlideIndex == 1}
      >
        <Tabs
          onChange={this.handleMainSlide.bind(this)}
          value={this.state.mainSlideIndex}
        >
          <Tab label={this.state.static_text["waiting"]} value={0}/>
          <Tab label={this.state.static_text["editquestion"]["question_page"]} value={1}/>
        </Tabs>
        <SwipeableViews
          index={this.state.mainSlideIndex}
          onChangeIndex={this.handleMainSlide.bind(this)}
        >
         {this. WaitingTab()}
         {this.QuestionTab()}
      </SwipeableViews>
      </Dialog>
      <Snackbar
        open={this.state.snack}
        message={this.state.message}
        autoHideDuration={2000}
        onRequestClose={this.handleRequestClose.bind(this)}
      />
    </span>)
  }
}

export default connect(mapStateToProps)(EditQuestion)
