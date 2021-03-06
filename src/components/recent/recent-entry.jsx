import React from 'react'
import axios from 'axios'
import { css } from 'emotion'





export default class BlogEntry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      feeds: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/feeds')
      .then((response) => {
        const feeds = response.data;
        console.log(feeds);
        this.setState({feeds: feeds})
      })
  }

  render() {

    this.state.feeds.sort(function(a,b) {
        let dateA = new Date(a.created_at)
        let dateB = new Date(b.created_at)
        return dateA - dateB
    })
    const sortedFeeds = this.state.feeds.reverse()

    return (
      <div className="feedEntryWrapper">
      { sortedFeeds.map((entries, index) =>
        <div className="feedEntry border" key={index}>
          {entries.profile_picture ?
            <img src={entries.profile_picture} height="150" width="150" className="feedProfilePic" />
          :
            <img src="/blank.png" height="150" width="150" className="feedProfilePic" />
          }
          <div className="feedContentContainer">
            <header>
              <h3 className="feedTitle">{entries.title}</h3>
            </header>
            <p>{entries.content}</p>
            <a href={entries.link}>{entries.link}</a>
          </div>
        </div>
      )}
      </div>
    )
  }
}


