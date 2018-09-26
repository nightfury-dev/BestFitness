import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';

const coordinates = (array) => {
  return {lat: array[0], lng: array[1]}
}


export class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapData: [],
      showingInfoWindow: false,
      selectedPlace: {},
      name: '',
      description: '',
      datetime: '',
      loading: true
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/event_maps')
      .then((response) => {
        const data = response.data;
        console.log("data is", data)
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
    console.log("this.state.selectedPlace",this.state.selectedPlace);
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

        <h3>{ mapInfo.name }</h3>
        <p>{mapInfo.description }</p>
        <p>{mapInfo.datetime}</p>

      </div>)
  });

    return (
      <main>
        <h2>Nearby Events:</h2>
        <Map
          google={this.props.google}
          zoom={16}
          initialCenter={{lat: 43.6446002, lng: -79.3951586}}
        >
          {generateMapMarkers}
          <InfoWindow onClose={this.onInfoWindowClose}
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}
          >
          <div>
            {mapInfos}
          </div>

          </InfoWindow>

        </Map>
      </main>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(MapContainer)

/*
const myPlaces = this.state.mapData
const toRender = myPlaces.map()
*/



