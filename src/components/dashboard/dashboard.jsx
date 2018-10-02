import React, { Component } from "react";
import { css } from 'emotion';
import Activities from './weekly-activities/weekly-activities.jsx';
import Nutrition from './nutrition.jsx';
import EventList from './event-list/event-list.jsx';
import FeedList from './feed-list/feed-list.jsx';
import FitnessGoals from './fitness-goals/fitness-goals.jsx'
import EventEntry from './event-list/event-entry.jsx'
import FeedEntry from './feed-list/feed-entry.jsx'
import IconPic from './image.png'



export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: props.name,
      id: props.id,
      weekly: weekly_data,
      nutrition: daily_nutrition,
      events: events,
      feeds: feeds,
      fitnessGoals: fitnessGoalsTest
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <main className="dashboardPage">
        <div className="dashboardHeader">
          <h1>Welcome Back, {this.state.currentUser}</h1>
        </div>
        <GoalList />
        <Activities />
        <Nutrition nutrition={this.state.nutrition}/>

        <EventList />
        <FeedList />
      </main>
    );
  }
}

// check how to limit event entry json from backend to only 3-5 events