import React from 'react'
import FitnessGoal from './fitness-goal.jsx'
import GoalForm from './fitness-goal-form.jsx'
import GoalEntry from './fitness-goal-entry.jsx'
const GoalList = (props) => {
  return (
    <div className="dashboardGoalEntry">
    <h3>GoalList</h3>
      {generateGoals()}
    </div>
  </main>
  )
}

export default GoalList
