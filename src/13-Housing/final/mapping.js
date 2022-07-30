import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import React, { useState, useRef, useMemo } from "react";

const placesLib = ["places"];
const Mapping = () => {
  const center = { lat: 44, lng: -80 };
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS,
    libraries: placesLib,
  });

  /**@type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  /**@type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  function printMe() {
    console.log("On Click!!");
  }
  async function calculateRoute() {
    //return on empty input fields
    console.log(originRef.current.value, destinationRef.current.value);
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    console.log(originRef.current.value, destinationRef.current.value);
    //directions api
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    console.log(directionsService);
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,

      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <form className="form">
        <Autocomplete>
          <input type="text" placeholder="origin" ref={originRef} />
        </Autocomplete>

        <Autocomplete>
          <input type="text" placeholder="destination" ref={destinationRef} />
        </Autocomplete>
        <button onClick={calculateRoute}>GO!</button>
        <button onClick={clearRoute}>Clear</button>
      </form>
      <GoogleMap
        zoom={11}
        center={center}
        mapContainerClassName="map"
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={{ lat: 44, lng: -80 }} />
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </div>
  );
};

export default Mapping;
