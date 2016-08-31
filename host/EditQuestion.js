import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Tabs, Tab} from 'material-ui/Tabs'
import {Card} from 'material-ui/Card'
import SwipeableViews from 'react-swipeable-views'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ImageEdit from 'material-ui/svg-icons/image/edit'
import FlatButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'

import { updateQuestion } from './actions'

const mapStateToProps = ({ question_text, page }) => ({
  question_text, page
})

class EditQuestion extends Component {
  constructor(props){
    super(props)
    const { question_text } = this.props
    this.state = {
      question_text: question_text,
      open: false,
      mainSlideIndex: 0,
      disabled: false,
      default_text: {
        'question': "国連でアフリカ諸国が占める割合は何％か？",
        'answered': "回答は終了しました。",
        'waiting_text': "参加者の登録を待っています。\nこの画面のまましばらくお待ちください。",
        'min': 0,
        'step': 1,
        'max': 100,
        'unit': "%"
      }
    }
  }

  QuestionTab(){
    return (
      <div style={{height: '100%', position: 'relative'}}>
        <TextField
         hintText={"問題"}
         defaultValue={this.state.question_text["question"]}
         onBlur={this.handleChange.bind(this, ["question"])}
         multiLine={true}
         fullWidth={true}
       /><br />
       <p>スライダーの設定</p><br />
        <TextField
         hintText={"最小値"}
         defaultValue={this.state.question_text["min"]}
         onChange={this.handleChangeOnlyNum.bind(this, ["min"])}
       /> から <TextField
         hintText={"最大値"}
         defaultValue={this.state.question_text["max"]}
         onChange={this.handleChangeOnlyNum.bind(this, ["max"])}
       /> まで<br />
       (単位:<TextField
         hintText={"単位"}
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
         hintText={"待機画面に表示するテキスト"}
         defaultValue={this.state.question_text["waiting_text"]}
         onBlur={this.handleChange.bind(this, ["waiting_text"])}
         multiLine={true}
         fullWidth={true}
       />
      </div>
    )
  }

  handleOpen() {
    this.setState({ open: true });
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

  submit() {
    const { dispatch } = this.props
    dispatch(updateQuestion(this.state.question_text))
    this.setState({ open: false })
  }

  reset(){
    const { dispatch } = this.props
    dispatch(updateQuestion(this.state.default_text))
    this.setState({ question_text: this.state.default_text, open: false, disabled: false })
  }

  render(){
    const { page } = this.props
    const actions = [
      <FlatButton
        label="適用"
        disabled={this.state.disabled}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.submit.bind(this)}
      />,
      <FlatButton
        label="キャンセル"
        onTouchTap={this.handleClose.bind(this)}
      />,
     <FlatButton
        label="すべてリセット"
        onTouchTap={this.reset.bind(this)}
      />,
    ]
    return (<div>
      <FloatingActionButton onClick={this.handleOpen.bind(this)} disabled={page != "waiting"}>
         <ImageEdit />
      </FloatingActionButton>
      <Dialog
        title="編集画面"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose.bind(this)}
        autoScrollBodyContent={this.state.mainSlideIndex == 1}
      >
        <Tabs
          onChange={this.handleMainSlide.bind(this)}
          value={this.state.mainSlideIndex}
        >
          <Tab label="待機画面" value={0}/>
          <Tab label="問題画面" value={1}/>
        </Tabs>
        <SwipeableViews
          index={this.state.mainSlideIndex}
          onChangeIndex={this.handleMainSlide.bind(this)}
        >
         {this. WaitingTab()}
         {this.QuestionTab()}
      </SwipeableViews>
      </Dialog>
    </div>)
  }
}

export default connect(mapStateToProps)(EditQuestion)