import React, { Component } from "react";
import axios from 'axios'
import NutritionInput from "./nutrition-input.jsx"
import ImageUpload from "./nutrition-upload-image.jsx"
import NutritionQuery from './nutrition-natural-language-query.jsx'
import NutritionList from './nutrition-list.jsx'


export default class Nutrition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: this.props.name,
      userID: this.props.userID,
      nutrition: [],
      image: null,
      imageName: null
    };
  }

  componentDidMount () {
    const options = {
      method: "GET",
      headers: {'content-type': 'application/json', 'Authorization': this.props.jwt},
      url: 'http://localhost:3000/api/user_nutritions'
    }
    axios(options)
      .then(response => {
        this.setState({nutrition: response.data})
      })
  }

  // manual submission of nutrition info

  _submitNutritionHandler = (e) => {
    e.preventDefault();
    const formInput = e.target.elements
    const inputDate = formInput.date.value.split('-')
    let datetime;
    const findDatetime = (date, hour) => {
      return new Date(Number(date[0]), Number(date[1]), Number(date[2]), hour)
    }
    switch (formInput.mealTime.value) {
      case "breakfast":
        datetime = findDatetime(inputDate, 7);
        break;
      case "lunch":
        datetime = findDatetime(inputDate, 12);
        break;
      case "dinner":
        datetime = findDatetime(inputDate, 18);
        break;
    }
    axios.post('http://localhost:3000/api/user_nutritions', {
      user_id: this.props.userID,
      calories: formInput.calories.value ? formInput.calories.value : 0,
      protein: formInput.protein.value ? formInput.protein.value : 0,
      fat: formInput.fat.value ? formInput.fat.value : 0,
      carbohydrates: formInput.carbohydrates.value ? formInput.carbohydrates.value : 0,
      sodium: formInput.sodium.value ? formInput.sodium.value : 0,
      cholesterol: formInput.cholesterol.value ? formInput.cholesterol.value : 0,
      serving_size: formInput.servingSize.value ? formInput.servingSize.value : 1,
      datetime: datetime,
      meal_query: formInput.mealType.value ? formInput.mealType.value : ""
    })
    .then((response) => {
      this.setState({nutrition: response.data})
    })
  }

  // image upload

  // handles image submission
  _uploadButtonHandler = (event) => {
    event.preventDefault();
    if (this.state.image) {
      const string = this.state.image;
      const result = string.split("base64,");
      axios.post('http://localhost:3000/api/image_recognition', {
        image: result[1],
        imageName: this.state.imageName,
        user_id: this.state.userID,
        datetime: event.target.datetime.value
      })
      .then((response) => {
        this.setState({
          nutrition: response.data,
          image: null,
          imageName: null
        })
        event.target.elements.datetime.value = null;
        event.target.elements.pic.value = null;
      })
    } else {
      alert("Please choose an image to upload!");
    }
  };

  //handles 'choose file' button
  _selectImageHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        imageName: event.target.files[0].name
      })
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  // natural language query

  _handleQuerySubmit = (e) => {
    e.preventDefault();
    const data = {
      query: e.target.query.value,
      datetime: e.target.datetime.value,
      user_id: this.state.userID
    }
    const options = {
      method: "POST",
      headers: {'content-type': 'application/json', 'Authorization': this.props.jwt},
      data: data,
      url: 'http://localhost:3000/api/nutrition_search'
    }
    axios(options)
      .then(response => {
        this.setState({nutrition: response.data})
      })
  }


  render() {
    return (
      <main >
        <h1>Nutrition page</h1>
        <div className="watson">
        This is where watson api will go.
        </div>
        <NutritionInput userID={this.state.userID} submitNutritionHandler={this._submitNutritionHandler} />
        <ImageUpload uploadButtonHandler={this._uploadButtonHandler} selectImageHandler={this._selectImageHandler} image={this.state.image} />
        <NutritionQuery handleQuerySubmit={this._handleQuerySubmit} />
        <NutritionList nutritionList={this.state.nutrition} />
      </main>
    );
  }
}