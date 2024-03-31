import React from "react";

const LocPermition = () => {
  return (
    <div style={{backgroundImage: `url('./images/bg4.jpg')`}} className="w-screen h-screen bg-cover bg-no-repeat flex flex-col items-center">
      <div className="box w-[80%] h-[70%]  mt-14 flex flex-col items-center relative xl:w-[50%] xl:h-[80%] xl:mt-8">
        <div className="w-full h-full bg-black opacity-60"></div>
        <img src={'images/WeatherIcons.gif'} className="size-72 absolute top-0 lg:size-96 xl:size-80" alt="" />
        <div className="content flex flex-col items-center absolute top-80 lg:top-96 xl:top-80">
          <div className="text-xl text-white font-bold lg:text-3xl xl:text-xl">
            Detecting Your Location
          </div>
          <div className="text-white mt-[4px] text-xs text-center lg:text-lg xl:text-sm">
            Your current location will be displayed on the App <br /> & used for
            calculating real time weather
          </div>
        </div>
      </div>
      <div className="footer-info text-white mt-8">
          | Developed by <a href="#">Jatin Yadav</a> |
      </div>
    </div>
  );
};

export default LocPermition;
