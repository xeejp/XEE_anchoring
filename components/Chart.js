import React, { Component } from 'react'
import { connect } from 'react-redux'
import throttle from 'react-throttle-render'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import Highcharts from 'react-highcharts'
import { ReadJSON } from '../util/ReadJSON'

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
    var text = ReadJSON().static_text["comp_chart"]
    if(!question_text) return null
    return (
    <Card
      expanded={this.state.expanded}
      onExpandChange={this.handleExpandChange.bind(this)}
    >
      <CardHeader
        title={text["title"]}
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
            text: text["title"]
        },
        xAxis: {
            title: {
                enabled: true,
                text: text["init_place"][0] + question_text['unit'] + text["init_place"][1]
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: text["answer"][0] + question_text['unit'] + text["answer"][1]
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
                    pointFormat: '{point.x} {text["from"]} {point.y}'
                }
            },
       },
        series: [{
            type: 'line',
            name: text["reg_line"],
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
            name: text["ans"],
            color: 'rgba(70, 70, 230, .5)',
            data: data
        }]
    }} />
      </CardText>
    </Card>
  )
  }
}

export default connect(mapStateToProps)(throttle(Chart, 200))
