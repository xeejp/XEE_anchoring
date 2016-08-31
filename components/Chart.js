import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import Highcharts from 'react-highcharts'

const mapStateToProps = ({ question_text }) => ({ question_text })

class Chart extends Component {
  constructor(props) {
    super(props)
    const { expanded } = this.props
    this.state = { expanded: expanded }
  }
  
  handleExpandChange(expanded) {
    this.setState({ expanded: expanded })
  }
  
  render() {
    const { data: [data, beta, t], question_text } = this.props
    return (
    <Card
      expanded={this.state.expanded}
      onExpandChange={this.handleExpandChange.bind(this)}
    >
      <CardHeader
        title={"実験結果"}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
            <Highcharts
              config={{
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        credits : {
            enabled: false,
        },
        title: {
            text: '実験結果'
        },
        xAxis: {
            title: {
                enabled: true,
                text: '初期位置 [' + question_text['unit'] + ']'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: '回答 [' + question_text['unit'] + ']'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} から {point.y}'
                }
            },
       },
        series: [{
            type: 'line',
            name: '回帰直線',
            data: beta,
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
            enableMouseTracking: false
        },{
            type: 'scatter',
            name: '回答',
            color: 'rgba(70, 70, 230, .5)',
            data: data
        }]
    }} />
    <p>切片のt値: {t[0]}</p>
    <p>傾きのt値: {t[1]}</p>
      </CardText>
    </Card>
  )
  }
}

export default connect(mapStateToProps)(Chart)