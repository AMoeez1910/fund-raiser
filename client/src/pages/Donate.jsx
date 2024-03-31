
import Navbar from '../components/Navbar';
import React, {useState,useEffect } from 'react'
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PersonFill } from "react-bootstrap-icons";
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Donate() {
    const [amount,setAmount]=useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name,setName] = useState('')
    const [id,setID] = useState()
    const {fid} = useParams();
    const navigate = useNavigate()
  const [donateInfo, setDonateInfo] = useState();
  const [iscount, setCount] = useState(0);
  const [active, setActive] = useState(true);
  //logic for sign in 
  axios.defaults.withCredentials=true
  console.log(isLoggedIn)
    console.log(fid+" this is")
    
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("donate/" + fid);
        
        console.log(response);
        setDonateInfo(response.data.info[0]);
        setCount(response.data.number[0].count);
        setActive(response.data.info[0].active);
        console.log(response.data.number[0].count + "is goooood")
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fid]);
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setIsLoggedIn(true);
      setID(parsedUserData.id)
    }
  }, [setIsLoggedIn]);
    const handlePayment =()=>{
      if(isLoggedIn){
        axios.post("/donate/create-checkout-session",
        {amount,id,fid}).then((res)=>{
            if(res.data.url){
                window.location.href=res.data.url
            }
        }).catch((err)=>console.log(err.message))
      }
      else{
        toast.error("Please Log In")
        navigate("/login")
      }
    }
    return (
      <>
        <Navbar links={[{}]} />
        <div>
          <section className="py-4 py-md-5 mt-5">
            <div className="container py-md-5">
              <h2 className="display-6 fw-bold mb-4">{donateInfo?.title}</h2>
              <div className="row d-flex">
                <div className="col-md-7 text-center">
                <img
                    className="img-fluid w-100 mb-4"
                    src={donateInfo?.imgUrl}
                    style={{ maxHeight: "350px", objectFit: "cover" }}
                  />
                  <div>
                    <div className="d-flex align-items-center align-items-md-start align-items-xl-center">
                      <div className="bs-icon-md bs-icon-circle bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center me-2 d-inline-block bs-icon">
                        <PersonFill />
                      </div>
                      <div className="justify-content-center align-items-center">
                        <p>
                          {donateInfo?.FullName} is organizing this event for{" "}
                          {donateInfo?.type}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <p>
                    Created on{" "}
                    {new Date(donateInfo?.startDate).toLocaleString("en-US", {
                      timeZoneName: "short",
                    })}
                  </p>

                  <hr />
                  <p className="w-100 text-start">{donateInfo?.description}</p>
                </div>
                <div className="col-md-5 col-xl-4 text-center text-md-start mx-4 px-3 py-4 shadow h-100">
                  <div>
                    <p className="text-muted mb-2 lead">
                      ${" "}
                      <span className="fw-bold">
                        {donateInfo?.currentAmount}
                      </span>{" "}
                      raised of {donateInfo?.goalAmount}
                    </p>
                    <div className="progress mt-2 " style={{ height: "8px" }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated "
                        role="progressbar"
                        style={{
                          width: `${
                            (donateInfo?.currentAmount /
                              donateInfo?.goalAmount) *
                            100
                          }%`,
                        }}
                        aria-valuenow={donateInfo?.currentAmount}
                        aria-valuemin="0"
                        aria-valuemax={donateInfo?.goalAmount}
                      ></div>
                    </div>
                    <p className="text-muted">{iscount} donations</p>
                    <p className="text-muted fw-bold mt-4">
                      Amount should not exceed 1,000,000
                    </p>
                    <div className="mb-3">
                      <input
                        className="shadow form-control"
                        type="number"
                        name="Amount"
                        placeholder="Amount"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      {active ? (
                        <button
                          className="btn btn-primary shadow w-100"
                          type="submit"
                          onClick={handlePayment}
                        >
                          Donate Now
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary shadow w-100"
                          type="submit"
                          onClick={handlePayment}
                          disabled
                        >
                          Donation Ended
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
}

{/* <input
                    className="shadow-sm form-control"
                    type="text"
                    name="Amount"
                    placeholder="Amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
      <button onClick={handlePayment}>Donate Now</button> */}

{/* ; */}