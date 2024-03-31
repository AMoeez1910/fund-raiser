
import React, { useState, useEffect } from "react";
import VolunteerTypePage from "./VolunteerTypePage";
import DriveAddressPage from "./DriveAddressPage";
import UploadCover from "./UploadCover";
import DriveDesc from "./DriveDesc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CreateVolunteer = () => {
   const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials=true
  axios.defaults.withCredentials = true;

  // useEffect(() => {
  //   axios.get(`https://fund-raiser-production.up.railway.app/profile`)
  //   .then(res => {
  //     console.log(res.data)
  //     if(res.data)
  //   {if(res.data.Status === "Success"){
  //       setIsLoggedIn(true)
  //       setID(res.data.id)
  //       getLoggedIn(true)
  //     }
  //     else{
  //       setIsLoggedIn(false)
  //     }}
  //   })
  // }, [isLoggedIn]);
  

  const handleNext = (...keyValuePairs) => {
    setData((prevData) => ({
      ...prevData,
      ...Object.fromEntries(keyValuePairs),
    }));
  
    setCurrentPage(currentPage + 1);

  };

  const handlePrev = () => {
    if (currentPage === 1) { return; }
    setCurrentPage(currentPage - 1);
  }


  useEffect(() => {
    console.log(data);
  })

  return (
    <div>
      {currentPage === 1 && <VolunteerTypePage onNext={handleNext} />}
       {currentPage === 2 && (
        <DriveAddressPage onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentPage === 3 && (
        <UploadCover onNext={handleNext} onPrev={handlePrev} />
      )}
      {currentPage === 4 && (
        <DriveDesc
          onNext={handleNext}
          onPrev={handlePrev}
          submitData={data}
        />
      )} 
    </div>
  );
}

export default CreateVolunteer
