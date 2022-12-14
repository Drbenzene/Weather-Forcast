import React, { useState, useEffect } from "react";
import axios from "axios";
import cities from "cities.json";

const GlobalContext = React.createContext();

const Provider = (props) => {
  const [city, setCity] = useState("");
  const [weatherCondition, setWeatherCondition] = useState(localStorage.weatherCondition ? JSON.parse(localStorage.weatherCondition) : []);
  const [town, setTown] = useState("");

  useEffect(() => {
    localStorage.setItem("weatherCondition", JSON.stringify(weatherCondition));
  }, [weatherCondition]);

  const weatherFetch = (lat, lon) => {
    const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=6890862a72fc7aabfe2222f2f2b1d4b0`;
    axios
      .get(api)
      .then((res) => {
        const weather = res.data;
        weatherData(weather);
        console.log(weather);
      })
      .catch((err) => {
        console.log(err, "Unable to fetch data from Openweather");
      });
  };

  const weatherData = (weather) => {


    console.log(weather.timezone);
    setWeatherCondition(weather);
    localStorage.setItem('weatherCondition', JSON.stringify(weather));
  };

  const changeHandler = (e) => {
    setCity(e.target.value);
    console.log(city);

  };

  const weatherHandler = (e) => {

        setTown(city)
    if (city === "") {
      setWeatherCondition([])
      return alert("Please Enter Your City")
    }
    const theCity = cities.find((item) => item.name === city);
    if (theCity === undefined) {
      return alert("City not found, Please Try a new Search.");
    }

    const lon = theCity.lng;
    const lat = theCity.lat;
    weatherFetch(lat, lon);
    setCity("")
  };

  const states = {
    weatherData,
    weatherFetch,
    weatherHandler,
    changeHandler,
    setWeatherCondition,
    weatherCondition,
    town, setTown
  };
  return (
    <GlobalContext.Provider value={states}>
      {props.children}
    </GlobalContext.Provider>
  );
};

const Consumer = GlobalContext.Consumer;

export { GlobalContext, Provider, Consumer };
