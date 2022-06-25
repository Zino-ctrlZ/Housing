import React, { useState, useReducer } from "react";
import { reducer } from "./reducer";

import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
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

  if (edit) {
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
                  <input list="relevance" id="relevance"></input>
                  {/* <select id="relevance" onChange={selectChange}>
                    <option value="3">important</option>
                    <option value="2">preferred</option>
                    <option value="1">convenience</option>
                  </select> */}
                </div>
              );
            })}

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
          {state.locations.map((location) => {
            return (
              <div className="item" key={location.id}>
                <h4>{location.address}</h4>
                <div>
                  <label htmlFor="score">Total Score : {location.score} </label>
                </div>
              </div>
            );
          })}
        </article>
      </>
    );
  }

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
                {/* <select id="relevance" onChange={selectChange}>
                  <option value="important">important</option>
                  <option value="preferred">preferred</option>
                  <option value="convenience">convenience</option>
                </select> */}
              </div>
            );
          })}
          <button className="button" onClick={handleSubmit}>
            compute
          </button>
          <button className="btn" onClick={() => setEdit(true)}>
            {" "}
            add new category
          </button>
        </form>
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
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS,
  });
  if (!isLoaded) {
    return <p>Loading</p>;
  }
  console.log("isLoaded", isLoaded);
  return (
    <GoogleMap
      zoom={10}
      center={{ lat: 44, lng: -80 }}
      mapContainerClassName="map"
    ></GoogleMap>
  );
};

const House = (props) => {
  if (!props.hasMap) {
    console.log(`hasMap is ${props.hasMap}`);
    return (
      <>
        <h4>{props.location.address}</h4>
        <div>
          <label htmlFor="score">Total Score : {props.location.score} </label>
        </div>
      </>
    );
  }

  return (
    <>
      <h4>{props.location.address}</h4>
      <div>
        <label htmlFor="score">Total Score : {props.location.score} </label>
      </div>
      <Map></Map>
    </>
  );
};
export default Index;
