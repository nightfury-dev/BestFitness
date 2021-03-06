import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import EventsMap from "./events-map.jsx";
import axios from 'axios';

const generateLatLng = (x, y) => {
  return {lat: x, lng: y}
}

const style = {
  height: '500px',
  width: '100%',
}

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '500px'
}




export class GymMap extends Component {

  constructor(props) {
    super(props)
    this._source = axios.CancelToken.source();
    this.state = {
      data: [],
      showingInfoWindow: false,
      selectedPlace: {},
      location: this.props.location,
      isMounted: false
    }
  }

  componentDidMount() {
    const options = {
      method: "GET",
      url: "http://localhost:3000/api/gym_maps",
      headers: {
        'content-type': 'application/json',
        'Authorization': this.props.jwt
      },
      cancelToken: this._source.token
    }
    axios(options)
      .then(response => {
        this.setState({
          data: response.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentWillUnmount() {
    this._source.cancel('gym map failing.')
  }

    // axios.get('http://localhost:3000/api/gym_maps')
    //   .then((response) => {
    //     const data = response.data;
    //      console.log("data is", data);
    //     this.setState({data})
    //   })

  // }


  onMarkerClick = (props, marker, event) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {
    const {google} = this.props;

    let generateMapMarkers = [];
    if (this.state.data && this.state.data.maps) {
      generateMapMarkers = this.state.data.maps.map ((marker, index) => {
        return <Marker position={marker} key={index}
                       icon={{
                         url: "/gym_map.svg",
                         anchor: new google.maps.Point(32,32),
                         scaledSize: new google.maps.Size(46,46)
    }}
                       onClick={this.onMarkerClick}
                       name={marker.name}/>
      });
    }

             />
   })
   console.log("this.state.selectedPlace", this.state.selectedPlace);
    console.log("this.state.selectedPlace.position", this.state.selectedPlace.position);
     console.log("type of this.state.selectedPlace.position", typeof(this.state.selectedPlace.position));

    return (
      <div className="gymsMap">
        <h2>Nearby Gyms:</h2>
        <div>
        <Map
        google={this.props.google}
        zoom={16}
        initialCenter={ {lat: 37.389439, lng: -121.992289} }>
        {generateMapMarkers}
          <InfoWindow onClose={this.onInfoWindowClose}
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}
          >
            <div>
              <h3>{this.state.selectedPlace.name}</h3>
              <p>{this.state.selectedPlace.position ? this.state.selectedPlace.position.vicinity : "none"}</p>
            </div>
          </InfoWindow>
        </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY),
  libraries: ['places']
})(GymMap)