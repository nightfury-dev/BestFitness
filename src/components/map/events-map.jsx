import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';
import { css } from 'emotion';


const latLng = (object) => {
  return {
    name: object.name,
    description: object.description,
    location: object.location,
    datetime: object.datetime,
    point : {
      lat: object.lat,
      lng: object.lng
    },
    id: object.id

  }
}

const style = {
  width: '100%',
  height: '500px'
}

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '500px'
}

export class EventMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapData: [],
      showingInfoWindow: false,
      selectedPlace: {},
      name: '',
      description: '',
      location: '',
      datetime: '',
      loading: true
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/event_maps')
      .then((response) => {
        const data = response.data;
        const oldMapData = this.state.mapData
        const newMapData = []
        data.forEach((location) => {
          newMapData.push(coordinates(location))
        })
        this.setState( {mapData: [...newMapData, ...oldMapData], loading: false} )
      })
  }

  onMarkerClick = (props, marker, event) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {
    const generateMapMarkers = this.state.mapData.map ((marker, index) => {
      return <Marker position={marker} key={index} onClick = {generateInfoWindow}/>
    })

    const generateInfoWindow = this.state.mapData.map ((info, index) => {
      console.log('clicked')
      return <InfoWindow visible={true} />
    })

  console.log("this.state.mapData[0]", this.state.mapData[0]);

  const myPlacesArray = this.state.mapData;
  console.log("myPlacesArray",myPlacesArray);

  const mapInfos = !myPlacesArray ? null : myPlacesArray.filter(event => event.name === this.state.selectedPlace.name).map((mapInfo) => {
    return (
      <div>

        <h3>{mapInfo.name }</h3>
        <p>{mapInfo.id}</p>
        <p>{mapInfo.description }</p>
        <p>{mapInfo.datetime}</p>

      </div>
      )
    });

    return (
      <Map google={this.props.google} style={style} containerStyle={containerStyle} zoom={16} initialCenter={{lat: 43.6446002, lng: -79.3951586}}>
        {generateMapMarkers}
        <InfoWindow onClose={this.onInfoWindowClose} marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
          <div className="mapInfo">
            {mapInfos}
          </div>
        </InfoWindow>
      </Map>
  )}
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(EventMap)

/*
const myPlaces = this.state.mapData
const toRender = myPlaces.map()
*/



