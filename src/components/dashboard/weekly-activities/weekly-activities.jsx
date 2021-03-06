import React, { Component } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

import { generateCurrentDateTime } from "../../../_helper.jsx"

export default class Activities extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_id: this.props.user_id,
      sun: 0,
      mon: 0,
      tues: 0,
      wed: 0,
      thurs: 0,
      fri: 0,
      sat: 0
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/exercise_sessions', {
      params: {
        user_id: this.state.user_id
      }
    })
    .then((response) => {
      const data = response.data;
      data.map( (obj) => {

        let date = new Date(obj.datetime)
        let day = date.getDay()
        let minutes = obj.minutes
        let sun = this.state.sun
        let mon = this.state.mon
        let tues = this.state.tues
        let wed = this.state.wed
        let thurs = this.state.thurs
        let fri = this.state.fri
        let sat = this.state.sat

        switch (day) {
          case 0:
            this.setState({sun: sun += obj.minutes})
            break;
          case 1:
            this.setState({mon: mon += obj.minutes})
            break;
          case 2:
            this.setState({tues: tues += obj.minutes})
            break;
          case 3:
            this.setState({wed: wed += obj.minutes})
            break;
          case 4:
            this.setState({thurs: thurs += obj.minutes})
            break;
          case 5:
            this.setState({fri: fri += obj.minutes})
            break;
          case 6:
            this.setState({sat: sat += obj.minutes})
            break;

        }
      });
    })

  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const timeNow = new Date();
    const timePost = Date.parse(e.target.elements.timeOfExercise.value)
    if (timeNow > timePost) {
       axios.post('http://localhost:3000/api/exercise_sessions', {
        minutes: e.target.elements.timeOnExercise.value,
        datetime: e.target.elements.timeOfExercise.value,
        user_id: this.props.user_id
      }).then((response) => {
        const data = response.data;

        let date = new Date(data.datetime)
        let day = date.getDay()
        let minutes = data.minutes
        let sun = this.state.sun
        let mon = this.state.mon
        let tues = this.state.tues
        let wed = this.state.wed
        let thurs = this.state.thurs
        let fri = this.state.fri
        let sat = this.state.sat

        switch (day) {
          case 0:
            this.setState({sun: sun += data.minutes})
            break;
          case 1:
            this.setState({mon: mon += data.minutes})
            break;
          case 2:
            this.setState({tues: tues += data.minutes})
            break;
          case 3:
            this.setState({wed: wed += data.minutes})
            break;
          case 4:
            this.setState({thurs: thurs += data.minutes})
            break;
          case 5:
            this.setState({fri: fri += data.minutes})
            break;
          case 6:
            this.setState({sat: sat += data.minutes})
            break;
        }
      })
      e.target.elements.timeOnExercise.value = "";
      e.target.elements.timeOfExercise.value = null;
    }
  }


  render() {

    return (
      <main className="dashboardWeeklyActivities border">
        <h3>Weekly Activities</h3>

          <div className={"dashboardCharts"}>
          <Chart
            chartType="ColumnChart"
            rows={[
              ["Sun", this.state.sun],
              ["Mon", this.state.mon],
              ["Tue", this.state.tues],
              ["Wed", this.state.wed],
              ["Thur", this.state.thurs],
              ["Fri", this.state.fri],
              ["Sat", this.state.sat]
            ]}
            columns={[
              {
                type: "string",
                label: "Day"
              },
              {
                type: "number",
                label: "Time Spent Exercising"
              }
            ]}
            options={
              // Chart options
              {
                backgroundColor: { fill: 'transparent' },
                animation:{
                  startup: true,
                  duration: 1000,
                  easing: 'out'
                },
                hAxis: {
                  title: "Days",
                  viewWindow: { min: 0, max: 7 }
                },
                vAxis: { title: "Time Spent (minutes)", viewWindow: { min: 0 } },
                legend: "none"
              }
            }

            legendToggle
          />
        </div >
      <h4>Exercise Time:</h4>
      <form onSubmit={this._handleSubmit} className="weeklyExercise">
        <label htmlFor="timeOnExercise">Time spent on exercise:</label>
        <input name="timeOnExercise" /><br/>
        <label htmlFor="timeOfExercise">DateTime:</label>
        <input type="datetime-local" name="timeOfExercise" defaultValue={generateCurrentDateTime()}/><br/>
        <input className="forShadow" type="submit"/>
      </form>
      </main>

    )
  }
}

