import React, { Component } from 'react';
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import logo from './logo.svg';
import './App.css';
import LandingPage from './components/home-page/landing-page.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import Maps from './components/map/fitness-maps.jsx';
import Nutrition from './components/nutrition/nutrition-main.jsx';
import Recent from './components/recent/recent-main.jsx';
import BlogMain from './components/blogs/blog-main.jsx';
import EventMain from './components/fitness-events/event-main.jsx';
import NavBar from './components/nav-bar/nav-bar.jsx'
import history from "./history.jsx"
import { withRouter, Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import { generateUserURL } from './_helper.jsx'
import { injectGlobal } from 'emotion'


injectGlobal`
  * {
    font-family: 'Open Sans', sans-serif;
    box-sizing: border-box;
  }
`


class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      currentUser: null,
      userID: null,
      jwt: null
    }
  }

  _handleLogin = (e) => {
    e.preventDefault();
    const loginObj = {
      email: e.target.email.value,
      password: e.target.password.value
    }
    const options = {
      method: "POST",
      headers: {'content-type': 'application/json'},
      data: loginObj,
      url: 'http://localhost:3000/api/login'
    }
    axios(options)
      .then((response) => {
        if (response.data) {
          const userInfo = jwt_decode(response.data)
          this.setState({
            currentUser: userInfo.firstName,
            userID: userInfo.userID,
            jwt: response.data
          }, () => {
            history.push(generateUserURL(this.state.userID, "dashboard"))
          })
        }
      })
  }

  _handleRegister = (e) => {
    e.preventDefault();
    const registrationObj = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      passwordConfirmation: e.target.passwordConfirmation.value,
      location: e.target.location.value
    }
    const options = {
      method: "POST",
      headers: {'content-type': 'application/json'},
      data: registrationObj,
      url: 'http://localhost:3000/api/register'
    }
    axios(options)
      .then((response) => {
        if (response.data) {
          const userInfo = jwt_decode(response.data)
          this.setState({
            currentUser: userInfo.firstName,
            userID: userInfo.userID,
            jwt: response.data
          }, () => {
            history.push(generateUserURL(this.state.userID, "dashboard"))
          })
        }
      })
    this.setState({current_user: registrationObj.firstName}, function(){
      console.log(this.state.current_user)
       history.push("/users/1/dashboard")
    })
  }

// do i need the user ID for navbar?? think some more
  render() {

    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" render={() => <LandingPage handleLogin={this._handleLogin} handleRegister={this._handleRegister} /> } />

          <Route exact path={generateUserURL(this.state.currentUser_id, "dashboard")} render={() => (this.state.userLoggedIn ?
                                                                (<div><NavBar handleLogout={this._handleLogout} id={this.state.currentUser_id}/>
                                                                <Dashboard /></div>) : <Redirect to="/" />)} />

          <Route exact path={generateUserURL(this.state.currentUser_id, "map")} render={() => (this.state.userLoggedIn ?
                                                                (<div><NavBar handleLogout={this._handleLogout} id={this.state.currentUser_id}/>
                                                                <Maps /></div>) : <Redirect to="/" />)} />

          <Route exact path={generateUserURL(this.state.currentUser_id, "nutrition")} render={() => (this.state.userLoggedIn ?
                                                                (<div><NavBar handleLogout={this._handleLogout} id={this.state.currentUser_id}/>
                                                                <Nutrition /></div>) : <Redirect to="/" />)} />

          <Route exact path={generateUserURL(this.state.currentUser_id, "blog")} render={() => (this.state.userLoggedIn ?
                                                               (<div><NavBar handleLogout={this._handleLogout} id={this.state.currentUser_id}/>
                                                                <Blog /></div>) : <Redirect to="/" />)} />

          <Route exact path={generateUserURL(this.state.current_user_id, "events")} render={() => (this.state.current_user !== null ?
                                                                (<div><NavBar id={this.state.current_user_id}/>
                                                                <Events /></div>) : <Redirect to="/" />)} />

          <Route exact path={generateUserURL(this.state.current_user_id, "recent")} render={() => (this.state.current_user !== null ?
                                                                (<div><NavBar id={this.state.current_user_id}/>
                                                                <Recent /></div>) : <Redirect to="/" />)} />

        </Switch>


      </Router>
    )
  }
};

export default App;
