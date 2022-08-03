import React, { useState, useReducer, useMemo } from "react";
import { reducer } from "./reducer";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect } from "react";

const defaultState = {
  locations: [],
  address: "",
  categories: { rent: "", location: "" },
};

var loadedState 
const Index = () => {
  const [catValue, setCatValue] = useState({ name: "" });
  const [edit, setEdit] = useState(false);
  const [state, dispatch] = useReducer(reducer, defaultState);

  const submit = (e) => {
    e.preventDefault();
    if (state.address && !edit) {
      //calculate an average
      let totalScore = 0;
      Object.keys(state.categories).forEach((v) => {
        totalScore += Number(state.categories[v]);
      });
      totalScore = totalScore / Object.keys(state.categories).length;

      //add new location to array
      const newLocation = {
        address: state.address,
        id: new Date().getMilliseconds().toString(),
        categories: state.categories, 
        score: totalScore,
      };
      dispatch({ type: "ADD_LOCATION", payload: newLocation }); //change this dispatch to reset
      dispatch({ type: "RESET" });
    }
  };

  const addNewCategory = () => {
    if (catValue.name) {
      setEdit(false);
      dispatch({ type: "ADD_CATEGORY", payload: catValue.name });
      setCatValue({ name: "" });
    }
  };

  return (
    <>
    <header>
      <div className="container--header">
            <h1><a href="/">The Apartment Ranker.</a></h1>
            <nav>
                <a href="#">Home</a>
                <a href="https://github.com/">Contact</a>
            </nav>
        </div>
    </header>
      <main>
        <form className="form" onSubmit={submit}>
          <div className="form-control">
            <label htmlFor="address">Address : </label>
            {/* <Autocomplete> */}
               <input
                type="text"
                id="address"
                name="address"
                value={state.address}
                onChange={(e)=>{dispatch({ type: "CHANGE_ADDRESS", payload: e.target.value });}}
              />
            {/* </Autocomplete> */}
             
          </div>
          <h4>Categories</h4>

          {Object.keys(state.categories).map((category) => {
            return (
              <div className="form-control" key={category + 1}>
                <label htmlFor={category}>{category} : </label>
                <div className="category--input">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    id={category}
                    name={category}
                    value={state.categories[category]}
                    onChange={(e)=> {dispatch({ type: "CHANGE_RANGE", payload: [e.target.name, e.target.value] });}}
                  />
                <button onClick={() => {dispatch({type: "REMOVE_CATEGORY", payload: category })}}><div className="btn--cancel">X</div></button>
                </div>
              </div>
            );
          })}
          <button className="button" onClick={submit}>
            compute
          </button>
          <button className="btn" onClick={() => setEdit(!edit)}>
            {" "}
            add new category
          </button>
        </form>

        {/* Add new category form */}
        {edit && (
          <form className="form">
            <h4>Enter new category name</h4>
            <div className="form-control">
              <label htmlFor="categoryName">category name : </label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={catValue.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setCatValue({ name: val });
                }}
              />
            </div>
            <button className="btn" onClick={addNewCategory}>
              submit
            </button>
          </form>
        )}
        <div className="list--house">
          {state.locations.map((location) => {
            return (
              <div className="item--house" key={location.id}>
                <House location={location} hasMap={"false"} ></House>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};


const House = (props) => {

  const [hover, setHover] = useState(false)
 
  if (!props.hasMap) {
    console.log(`hasMap is ${props.hasMap}`);
    return (
      <>
        <h4>{props.location.address}</h4>
          <label htmlFor="score">Total Score : {props.location.score} </label>
          <ul className="categories">{Object.keys(props.locations.categories).forEach((v) => {
            return <li key={v + 1}>{`${v} : ${props.locations[v]}`}</li>
          })})</ul>
      </>
    );
  }

  return (
    <>
      <div onMouseEnter={()=> setHover(true)} onMouseLeave={()=> setHover(false)}>
           <h4>{props.location.address}</h4>
          <label htmlFor="score">Total Score : {props.location.score} </label>
          {hover && <ul className="categories">{props.location.categories && Object.keys(props.location.categories).map((v) => {
              return <li>{`${v} : ${props.location.categories[v]}`}</li>
            })}</ul>}
      </div>
      <Map address={props.location.address}></Map>
    </>
  );
};

const Map = ({address}) => {
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);
 
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS,
    libraries: ["places"],
  });
  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)

  useEffect(() => {
    calculateRoute() 
  }, [])
  async function calculateRoute() {
    if (!address) return
    //eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: address,
      destination: "515 North 6th Street, St. Louis, Missouri, United States", 
      //eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING
    })
    console.log('address: ', address)
    console.log('result:', results)
    setDirectionsResponse(results)
  }
  if (!isLoaded) {
    return <p>Loading</p>;
  }
  return (
    <GoogleMap
      zoom={5}
      center={center}
      mapContainerClassName="map"
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
      onLoad={map => setMap(map)}
    >
      <Marker position={center}></Marker>
      {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
    </GoogleMap>
  );
};


export default Index;
