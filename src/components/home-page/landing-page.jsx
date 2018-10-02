import React, { Component } from 'react'
import Pic from './img-01.png'
import LoginForm from './login-form.jsx'
import RegistrationForm from './registration.jsx'



const LandingPage = (props) => {
    return (
      <div className="landingPage">
        <div className="landingForms">
          <h1 className="landingHeader">YourFitnessPal</h1>
          <div className="landingImg">
            <img src={Pic} alt="IMG"></img>
          </div>
          <LoginForm handleLogin={props.handleLogin}/>
          <RegistrationForm handleRegister={props.handleRegister}/>
        </div>
      </div>
    )
}

export default LandingPage;