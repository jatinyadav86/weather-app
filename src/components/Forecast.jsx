import React, { useState, useEffect } from "react";
import axios from "axios";
import LocPermition from "./LocPermition";
import apiKeys from "../apiKey.js";

const Forecast = () => {

  // defining states
  const [data, setData] = useState({});
  const [currData, setCurrData] = useState({});
  const [fetched, setFetched] = useState(false);
  const [permition, setPermition] = useState(false);
  const [background, setBackground] = useState("https://res.cloudinary.com/doswveiik/image/upload/v1723117103/city_d4irte.jpg");
  const [back, setBack] = useState("");

  // function to get day from a given date like 15/06/2024 -> Saturday
  const getDay = (day) => {
    let newDay = new Date(day);
    const getExectDay = (day) => {
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[day];
    };
    return getExectDay(newDay.getDay());
  };

  // function that converts a certain day like Monday into Mon
  const slicedDay = (date) => {
    return getDay(date).slice(0, 3);
  };

  // function that converts a simple date format into format like (Saturday, 15 June 2024)
  const getDate = (date) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const arr = date.split("-");
    const day = getDay(date);
    const month = months[parseInt(arr[1]) - 1];
    return `${day}, ${arr[2]} ${month} ${arr[0]}`;
  };

  // The main logic starts from here

  // getting location coordiates of a user (lat,lon)
  const getLocation = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };


  useEffect(() => {
    if (navigator.geolocation) {
      getLocation()
        .then((position) => {
          getPlace(position.coords.latitude, position.coords.longitude);
          setPermition(true);
        })
        .catch((err) => {
          setPermition(false);
          setFetched(true);
        });
    } else {
      alert("Geolocation not available");
    }
    // logic to change background depending on day or night
    const d = new Date();
    let hour = d.getHours();
    setBack(hour >= 6 && hour < 18 ? 'https://res.cloudinary.com/doswveiik/image/upload/v1722759237/day-bg_etdx9x.jpg' : 'https://res.cloudinary.com/doswveiik/image/upload/v1722759280/night-bg_hepbo1.jpg');
  }, []);

  // geeting name of location using lat and lon
  const getPlace = (lat, lon) => {
    axios
      .get(`${apiKeys.locationBase}?key=${apiKeys.locationkey}&lat=${lat}&lon=${lon}&format=json`)
      .then((response) => {
        const data = response.data;
        getWeather(
          `${data.address.city},${data.address.state},${data.address.country_code}`
        );
      })
      .catch((err) => {
        alert("Something went wrong while detecting your location")
      });
  };

  // geeting weather of a given location from visualcrossing api
  const getWeather = (address) => {
    axios
      .get(`${apiKeys.weatherBase}/${address}?unitGroup=metric&include=days%2Calerts%2Cevents&key=${apiKeys.weatherkey}contentType=json`)
      .then(async (response) => {
        const weather = response.data;
        setCurrData(weather.days[0]);
        setData(weather);
        setFetched(true);
        setPermition(true);
        changeBg(weather.days[0].icon);
        document.querySelector("#cityName").value = "";
        document.querySelector("#cityName2").value = "";
        const myElement = document.getElementById("forecast");
        for (const child of myElement.children) {
          child.classList.remove("rounded-lg", "bg-blue-600");
          child.classList.add("hover:bg-blue-950", "hover:rounded-lg");
        }
        myElement.children[0].classList.remove(
          "hover:bg-blue-950",
          "hover:rounded-lg"
        );
        myElement.children[2].classList.remove(
          "hover:bg-blue-950",
          "hover:rounded-lg"
        );
        myElement.children[2].classList.add("rounded-lg", "bg-blue-600");
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          if (err.response.data == "Bad API Request:Invalid location parameter value.") {
            alert("Please enter a valid city name");
          }
        }
      });
  };

  // function to handle click on search icon in large devices
  const handleClick = (e) => {
    e.preventDefault();
    if (document.querySelector("#cityName").value.length <= 1) {
      alert("Please enter a valid city name");
    } else {
      const city = document.querySelector("#cityName").value;
      const sanitizedValue = encodeURIComponent(city)
      getWeather(sanitizedValue);
    }
  };

  // function to handle click on search icon in small devices
  const handleClick2 = (e) => {
    e.preventDefault();
    if (document.querySelector("#cityName2").value.length <= 1) {
      alert("Please enter a valid city name");
    } else {
      const city = document.querySelector("#cityName2").value;
      const sanitizedValue = encodeURIComponent(city)
      getWeather(sanitizedValue);
    }
  };

  // function which display weather data of different dates when user click on certain date
  const handleData = (number, cls) => {
    setCurrData(data.days[number]);
    changeBg(data.days[number].icon);
    const myElement = document.getElementById("forecast");
    for (const child of myElement.children) {
      child.classList.remove("rounded-lg", "bg-blue-600");
      child.classList.add("hover:bg-blue-950", "hover:rounded-lg");
    }
    myElement.children[0].classList.remove("hover:bg-blue-950", "hover:rounded-lg");
    document.querySelector(cls).classList.remove("hover:bg-blue-950", "hover:rounded-lg");
    document.querySelector(cls).classList.add("rounded-lg", "bg-blue-600");
    console.log(data)
  };

  // function to change background based on different weather condition
  const changeBg = (icon) => {
    const d = new Date();
    let hour = d.getHours();

    if (icon == "hail") {
      setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723119028/hail-day_t1kavo.jpg");
    } else if (icon == "sleet") {
      setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723119204/sleet-day_bhdpat.jpg");
    } else if (icon == "thunder") {
      setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723119377/thunder-day2_toohjx.jpg");
    } else if (icon == "thunder-rain" || icon == "thunder-showers-day" || icon == "thunder-showers-night") {
      setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723119320/thunder-rain-day_vntoso.jpg");
    } else {
      if (hour >= 6 && hour < 18) {
        if (icon == "clear-day" || icon == "clear-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723117250/clear-day_hhyk79.jpg");
        } else if (icon == "cloudy") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723117317/cloudy-day_wod7vj.jpg");
        } else if (icon == "fog") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723117510/fog-day_ct1kll.jpg");
        } else if (icon == "partly-cloudy-day" || icon == "partly-cloudy-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120044/partly-cloudy-day_sq5hcf.jpg");
        } else if (icon == "rain-snow-showers-day" || icon == "rain-snow-showers-night" || icon == "rain-snow") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120141/rain-snow-showers-day_u6sjrd.jpg");
        } else if (icon == "rain") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120285/rain-day_p4cut3.jpg");
        }  else if (icon == "showers-day" || icon == "showers-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120528/rain-snow-showers-day_yk596c.jpg");
        } else if (icon == "snow-showers-day" || icon == "snow-showers-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120528/rain-snow-showers-day_yk596c.jpg");
        } else if (icon == "snow") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120699/snow-day_hsjclk.jpg");
        } else if (icon == "wind") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723121003/wind-day_xmb8ax.jpg");
        } else {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723117250/clear-day_hhyk79.jpg");
        }
      } else {
        if (icon == "clear-day" || icon == "clear-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723117286/clear-night_lh1cjl.jpg");
        } else if (icon == "cloudy") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723117442/cloudy-night_jkfchi.jpg");
        } else if (icon == "fog") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723118963/fog-night_dsefp0.jpg");
        } else if (icon == "partly-cloudy-day" || icon == "partly-cloudy-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120082/partly-cloudy-night_pyv0np.jpg");
        } else if (icon == "rain-snow-showers-day" || icon == "rain-snow-showers-night" || icon == "rain-snow") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120168/rain-snow-showers-night_dqyoge.jpg");
        } else if (icon == "rain") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120424/rain-night_cn2j7g.jpg");
        } else if (icon == "showers-day" || icon == "showers-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120565/rain-snow-showers-night_rizvdb.jpg");
        } else if (icon == "snow-showers-day" || icon == "snow-showers-night") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120565/rain-snow-showers-night_rizvdb.jpg");
        } else if (icon == "snow") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723120742/snow-night_psfqk4.jpg");
        } else if (icon == "wind") {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723121074/wind-night_vsrsts.jpg");
        } else {
          setBackground("https://res.cloudinary.com/doswveiik/image/upload/v1723117286/clear-night_lh1cjl.jpg");
        }
      }
    }


  };

   // function to get icon url based on icon name
  const getIcon = (icon => {
    if (icon == "cloudy") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044658/cloudy_clkc3q.png");
    } else if (icon == "fog") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044795/fog_t1ycow.png");
    } else if (icon == "hail") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044887/hail_orfnhl.png");
    } else if (icon == "rain") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044991/rain_xkgm9n.png");
    } else if (icon == "rain-snow") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045066/rain-snow_ast5bv.png");
    } else if (icon == "sleet") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045241/sleet_ufblwp.png");
    } else if (icon == "snow") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045321/snow_nqn97e.png");
    } else if (icon == "thunder") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045416/thunder_cv7zeq.png");
    } else if (icon == "thunder-rain") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045476/thunder-rain_gkc2yo.png");
    } else if (icon == "wind") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723114083/wind_e1dves.png");
    } else if (icon == "clear-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044403/clear-day_abbfch.png");
    } else if (icon == "partly-cloudy-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044940/partly-cloudy-day_nrvhzi.png");
    } else if (icon == "rain-snow-showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045114/rain-snow-showers-day_rgbl0r.png");
    } else if (icon == "showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045180/showers-day_c7p1ha.png");
    } else if (icon == "snow-showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045361/snow-showers-day_heikpn.png");
    } else if (icon == "thunder-showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723045476/thunder-rain_gkc2yo.png");
    } else if (icon == "clear-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044477/clear-night_vcjhv2.png");
    } else if (icon == "partly-cloudy-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723114579/partly-cloudy-night_k1kw2g.png");
    } else if (icon == "rain-snow-showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723114652/rain-snow-showers-night_qru0nv.png");
    } else if (icon == "showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723114750/showers-night_dwlr7b.png");
    } else if (icon == "snow-showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723114820/snow-showers-night_iugj0b.png");
    } else if (icon == "thunder-showers-day") {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723114912/thunder-showers-night_pz1fn4.png");
    } else {
      return ("https://res.cloudinary.com/doswveiik/image/upload/v1723044403/clear-day_abbfch.png")
    }
  })

  if (fetched) {
    return (
      <div style={{ backgroundImage: `url('${back}')` }} className="w-screen xl:h-screen relative bg-cover bg-no-repeat flex justify-center xl:static no-scrollbar">
        <div style={{ backgroundImage: `url(${background})` }} className={`currentLocation w-full ${permition ? "h-[1300px]" : "h-[120vh]"} bg-cover bg-no-repeat flex flex-col items-center lg:w-screen lg:h-screen overflow-hidden lg:items-start xl:w-[30%] xl:h-[80%] xl:relative xl:mt-8 transition-all ease-in-out duration-1000 delay-100 rounded-l-lg`}>
          <div className="city w-full flex items-center justify-center lg:justify-around lg:hidden">
            <form onSubmit={handleClick2} className="flex justify-center items-center">
              <input type="text" className="cityName2 w-44 py-2 pl-4 text-xl bg-transparent outline-none border-transparent focus:border-transparent focus:ring-0  text-white placeholder-white lg:hidden" name="city" id="cityName2" placeholder="Search any city" />
              <button className="size-11  flex items-center justify-center xl:size-7">
                <img src="https://res.cloudinary.com/doswveiik/image/upload/v1722758323/search-icon_rxuik1.png" className="size-7" alt="" />
              </button>
            </form>
          </div>
          <div className="w-full h-[1px] bg-black opacity-50 lg:hidden"></div>
          <form onSubmit={handleClick} className="hidden mt-32 ml-32 border-2 border-white rounded-xl lg:flex items-center xl:mt-20 xl:ml-28 xl:border xl:rounded-md">
            <input type="text" className="cityName w-60 py-2 pl-4 text-xl bg-transparent outline-none border-transparent focus:border-transparent focus:ring-0 text-white placeholder-white xl:w-40 xl:text-sm xl:py-0" name="city" id="cityName" placeholder="Search any city" />
            <button className="size-11  flex items-center justify-center xl:size-7" >
              <img src="https://res.cloudinary.com/doswveiik/image/upload/v1722758323/search-icon_rxuik1.png" className="size-7 xl:size-5" alt="" />
            </button>
          </form>
          {permition ? (
            <div>
              <div className="data w-[200px] h-[200px] text-white flex flex-col justify-center items-center lg:ml-40 lg:mt-8 xl:ml-24">
                <div className="place text-xs font-medium text-center">
                  {data.resolvedAddress}
                </div>
                <div className="temp text-7xl my-2 font-medium">
                  {Math.ceil(currData.temp)}°c
                </div>
                <div className="text-xl my-1 font-medium">
                  L:{Math.ceil(currData.tempmin)}° &nbsp; H:
                  {Math.ceil(currData.tempmax)}°
                </div>
              </div>
              <div className="date hidden text-white font-bold text-2xl absolute bottom-8 left-6 lg:block xl:text-sm xl:bottom-5 xl:left-4">
                <div>{getDate(encodeURIComponent(currData.datetime))}</div>
              </div>
            </div>
          ) : (
            <div className="data w-[300px] h-[200px] text-white flex flex-col justify-center items-center mt-5 lg:ml-20 lg:mt-16 xl:ml-14">
              <img src="https://res.cloudinary.com/doswveiik/image/upload/v1723043688/location_x2ojpk.png" className="size-16 lg:size-24" alt="" />
              <div className="w-[100%] my-5 text-sm text-center font-bold">
                You have disabled location service. Either allow the location
                service or search any city to see weather forecast.
              </div>
            </div>
          )}
        </div>
        <div className={`forecast w-[85%] ${permition ? "h-[940px]" : "h-[50%]"}  absolute top-64 lg:w-[40%] lg:h-[90vh] lg:top-12 lg:right-28 xl:relative xl:w-[20%] xl:h-[80%] xl:mt-8 xl:inset-0 scrollbar rounded-r-lg`} >
          <div className="w-full rounded-xl h-full bg-black opacity-40 absolute top-0 z-10  xl:opacity-70 xl:rounded-r-lg xl:rounded-l-none"></div>
          {permition ? (
            <div className="w-full h-full absolute top-0 flex flex-col items-center z-20 overflow-y-scroll scrollbar">
              <img src={getIcon(currData.icon)} className="main-image size-28 my-4 lg:size-20" alt="icon" />
              <div className="condition text-white text-3xl font-medium my-1 lg:text-xl text-center">
                {currData.conditions}
              </div>
              <div className="w-[80%] mt-4 mb-3  text-xs font-medium text-white lg:text-sm text-center">
                {currData.description.slice(0, currData.description.length - 1)}
              </div>
              <div className="temp w-[90%] px-4 py-2 text-white flex justify-between lg:text-xs">
                <div>Temperature</div>
                <div>{Math.ceil(currData.temp)}°C</div>
              </div>
              <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
              <div className="temp w-[90%] px-4 py-2 text-white flex justify-between lg:text-xs">
                <div>Humidity</div>
                <div>{Math.ceil(currData.humidity)}%</div>
              </div>
              <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
              <div className="temp w-[90%] px-4 py-2 text-white flex justify-between lg:text-xs">
                <div>Visibility</div>
                <div>{Math.ceil(currData.visibility)} Km</div>
              </div>
              <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
              <div className="temp w-[90%] px-4 py-2 text-white flex justify-between lg:text-xs">
                <div>Wind Speed</div>
                <div>{Math.ceil(currData.windspeed)} Km/h</div>
              </div>
              <div id="forecast" className="forecast-cont my-5 w-[90%] h-[460px] border-2 border-white/50 rounded-lg  flex flex-col items-center">
                <div className="temp w-[90%] py-2 text-white flex items-center">
                  <img src="https://res.cloudinary.com/doswveiik/image/upload/v1723043982/calendar-icon_s3iczn.png" className="size-7 mr-3" alt="" />
                  10 - DAY FORECAST
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-1 w-[90%] my-2 text-white rounded-lg flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(0, ".box-1"); }}>
                  <div className="w-14 ml-2">TODAY</div>
                  <img src={getIcon(data.days[0].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(currData.temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-2 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(1, ".box-2") }} >
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[1].datetime)}
                  </div>
                  <img src={getIcon(data.days[1].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[1].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-3 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(2, ".box-3"); }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[2].datetime)}
                  </div>
                  <img src={getIcon(data.days[2].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[2].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-4 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(3, ".box-4") }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[3].datetime)}
                  </div>
                  <img src={getIcon(data.days[3].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[3].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-5 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(4, ".box-5") }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[4].datetime)}
                  </div>
                  <img src={getIcon(data.days[4].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[4].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-6 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(5, ".box-6") }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[5].datetime)}
                  </div>
                  <img src={getIcon(data.days[5].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[5].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-7 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(6, ".box-7") }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[6].datetime)}
                  </div>
                  <img src={getIcon(data.days[6].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[6].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-8 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(7, ".box-8") }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[7].datetime)}
                  </div>
                  <img src={getIcon(data.days[7].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[7].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-9 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(8, ".box-9") }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[8].datetime)}
                  </div>
                  <img src={getIcon(data.days[8].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[8].temp)}°</div>
                </div>
                <div className="w-[90%] h-[1px] bg-white opacity-50"></div>
                <div className="box-10 w-[90%] my-2 text-white flex items-center justify-between lg:text-xs cursor-pointer" onClick={() => { handleData(9, ".box-10") }}>
                  <div className="w-14 ml-2">
                    {slicedDay(data.days[9].datetime)}
                  </div>
                  <img src={getIcon(data.days[9].icon)} className="size-6 mr-9" alt="" />
                  <div className="pr-2">{Math.ceil(data.days[9].temp)}°</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full absolute top-0 flex flex-col items-center z-20 lg:h-[90vh] xl:h-full ">
              <img src="https://res.cloudinary.com/doswveiik/image/upload/v1722758300/server_b5hq40.gif" className="size-44 mt-20" alt="" />
              <div className="text-white text-xl font-bold mt-8">
                No Weather Data
              </div>
            </div>
          )}
        </div>
        <div className="footer-info absolute bottom-10 text-white lg:hidden xl:block">
          | Developed by <a href="#">Jatin Yadav</a> |
        </div>
      </div>
    );
  } else {
    return <LocPermition back={back} />;
  }
};

export default Forecast;