import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PersonFill } from "react-bootstrap-icons";
import toast from "react-hot-toast";
import axios from "axios";
import { GeoAltFill } from "react-bootstrap-icons";

const VolunteerPage = () => {
    const [amount, setAmount] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [id, setID] = useState();
    const { did } = useParams();
    const navigate = useNavigate();
    const [active, setActive] = useState(false);
    const [volunteerInfo, setVolunteerInfo] = useState();
    const [iscount, setCount] = useState(0);
    //logic for sign in
    axios.defaults.withCredentials = true;

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("drive/did/" + did);
          setVolunteerInfo(response.data.info[0]);
          setCount(response.data.number[0].count);
          setActive(response.data.info[0].active);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [did]);
    const handleVolunteer = () => {

        if (isLoggedIn) {
            axios
                .post("/drive/volunteer", { id, did })
                .then((res) => {
                    if (res.data.message === "Success") {
                        toast.success("Succesfully Volunteered");
                        navigate("/");
                    }
                })
                .catch((err) => toast.error("Already Volunteered"));
        } else {
            toast.error("Please Log In");
            navigate("/login");
        }
    }
    useEffect(() => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setIsLoggedIn(true);
        setID(parsedUserData.id)
      }
    }, [setIsLoggedIn]);
  
        return (
          <>
            <Navbar links={[{}]} />
            <div>
              <section className="py-4 py-md-5 mt-5">
                <div className="container py-md-5">
                  <h2 className="display-6 fw-bold mb-4">
                    {volunteerInfo?.title}
                  </h2>
                  <div className="row d-flex">
                    <div className="col-md-7 text-center">
                      <img
                        className="img-fluid w-100 mb-4"
                        src={volunteerInfo?.imgUrl}
                        style={{ maxHeight: "350px", objectFit: "cover" }}
                        alt="Volunteer Image"
                      />
                      <div>
                        <div className="d-flex align-items-center align-items-md-start align-items-xl-center">
                          <div className="bs-icon-md bs-icon-circle bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center me-2 d-inline-block bs-icon">
                            <PersonFill />
                          </div>
                          <div className="justify-content-center align-items-center">
                            <p>
                              {volunteerInfo?.FullName} is organizing this  {volunteerInfo?.type} Drive
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <p>
                        Created on{" "}
                        {new Date(volunteerInfo?.startDate).toLocaleString(
                          "en-US",
                          {
                            timeZoneName: "short",
                          }
                        )}
                      </p>

                      <hr />
                      <p className="w-100 text-start">
                        {volunteerInfo?.description}
                      </p>
                    </div>
                    <div className="col-md-5 col-xl-4 text-center text-md-start mx-4 px-3 py-4 shadow h-100">
                      <div>
                        <p>
                          Ends on{" "}
                          {new Date(volunteerInfo?.endDate).toLocaleString(
                            "en-US",
                            {
                              timeZoneName: "short",
                            }
                          )}
                        </p>
                        <p className="text-muted mb-2 lead">
                          {iscount} participants
                        </p>
                        <p className="text-muted fw-bold mt-4">
                          <GeoAltFill /> {volunteerInfo?.location}
                        </p>
                        <div>
                          <span className="badge rounded-pill text-dark bg-secondary mb-4">
                            {volunteerInfo?.type} Drive
                          </span>
                        </div>
                        <div className="mb-2">
                          {active? (<button
                            className="btn btn-primary shadow w-100"
                            type="submit"
                            onClick={handleVolunteer}
                          >
                            Volunteer Now
                          </button>):
                         ( <button
                            className="btn btn-primary shadow w-100"
                            type="submit"
                            onClick={handleVolunteer}
                            disabled
                          >
                            Volunteer Ended
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
    };

export default VolunteerPage;
