import React, { useState, useReducer, useMemo } from "react";
import { reducer } from "./reducer";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const defaultState = {
  locations: [],
  address: "",
  categories: { rent: "", location: "" },
};
const Index = () => {
  const [catValue, setCatValue] = useState({ name: "" });
  const [edit, setEdit] = useState(false);
  const [state, dispatch] = useReducer(reducer, defaultState);

  const handleChange = (e) => {
    const value = e.target.value;
    dispatch({ type: "CHANGE_ADDRESS", payload: value });
  };

  const handleRangeChange = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    dispatch({ type: "CHANGE_RANGE", payload: [name, value] });
  };

  const handleSubmit = (e) => {
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
      <article>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="address">Address : </label>
              <input
                type="text"
                id="address"
                name="address"
                value={state.address}
                onChange={handleChange}
              />
          </div>
          <h4>Categories</h4>

          {Object.keys(state.categories).map((category) => {
            return (
              <div className="form-control" key={category + 1}>
                <label htmlFor={category}>{category} : </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  id={category}
                  name={category}
                  value={state.categories[category]}
                  onChange={handleRangeChange}
                />
              </div>
            );
          })}
          <button className="button" onClick={handleSubmit}>
            compute
          </button>
          <button className="btn" onClick={() => setEdit(!edit)}>
            {" "}
            add new category
          </button>
        </form>

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
                <House location={location} hasMap={"false"}></House>
              </div>
            );
          })}
        </div>
      </article>
    </>
  );
};

const Map = () => {
  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS,
    libraries: ["places"],
  });
  if (!isLoaded) {
    return <p>Loading</p>;
  }
  console.log("isLoaded", isLoaded);
  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerClassName="map"
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker position={center}></Marker>
    </GoogleMap>
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
      <Map></Map>
    </>
  );
};
export default Index;
