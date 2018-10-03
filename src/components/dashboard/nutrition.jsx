import React, { Component } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import NutritionChart from './nutrition-chart.jsx'

export default class Nutrition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_id: 1,
      nutrition: null
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/user_nutritions', {
      params: {
        user_id: this.state.user_id
      }
    })
    .then(response => {
      const data = response.data;
      console.log(data)
      if (response.data.length > 0) {
        this.setState({
          nutrition: {
            calories: data.calories,
            protein: data.protein,
            fat: data.fat,
            carbohydrates: data.carbohydrates,
            sugar: data.sugar,
            sodium: data.sodium,
            cholesterol: data.cholesterol
          }
        })
      }
    })
  }

  render() {
    const generateNutritionChart = () => {
      if (this.state.nutrition) {
        return (
          <NutritionChart
            protein={this.state.nutrition.protein}
            fat={this.state.nutrition.fat}
            carbohydrates={this.state.nutrition.carbohydrates}
            pieOptions={pieOptions}
            calories={this.state.nutrition.calories}
          />
        )
      }
    }

    const generateNoNutritionMessage = () => {
      if (!this.state.nutrition) {
        return(
          <div className="dashboardCharts">
            <h3>Hey There!</h3>
            <h4>From our data, it looks like you haven't eaten in a week - go get some food you must be famished. It's time to get off your butt and log your food!</h4>
          </div>
        )
      }
    }


    const pieOptions = {
      title: "Calories/Nutrient",
      titleTextStyle: {
        color: 'black',
        fontName: 'Roboto',
        fontSize: 18,
        bold: true,
        italic: false
      },
      backgroundColor: { fill: 'transparent' },
      pieHole: 0.6,
      slices: [
        {
          color: "#2BB673"
        },
        {
          color: "#d91e48"
        },
        {
          color: "#007fad"
        },
        {
          color: "#e9a227"
        },
        {
          color: "#7F3FBF"
        },
        {
          color: "#A5A5A5"
        }
      ],
      legend: {
        position: "bottom",
        alignment: "center",
        textStyle: {
          color: "233238",
          fontSize: 14
        }
      },
      tooltip: {
        showColorCode: true
      },
      chartArea: {
        left: 0,
        top: 50,
        width: "100%",
        height: "80%"
      },
      fontName: "Roboto"
    };


    return (
      <main className="dashboardNutrition border">
        {this.state.nutrition &&
          <div className="dashboardCharts">

            <Chart
              chartType="PieChart"
              data={[
                ["Nutrition", "Calories"],
                ["Protein", this.state.nutrition.protein * 4],
                ["Fat", this.state.nutrition.fat * 9],
                ["Carbohydrates", this.state.nutrition.carbohydrates * 4]
                // ["Cholesterol", this.state.nutrition.cholesterol],
                // ["Sugar", this.state.nutrition.sugar],
                // ["Sodium", this.state.nutrition.sodium]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        }
      </main>
    )
  }
}
