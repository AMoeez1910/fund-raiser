import React, { useState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DriveDesc = ({ onNext, onPrev, submitData }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [user, setUser] = useState(false);
  const [id,setID] = useState()
  
  
  axios.defaults.withCredentials=true
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
      setID(parsedUserData.id)
    }
  }, [setUser]);

  // useEffect(() => {
  //   axios.get(`https://fund-raiser-production.up.railway.app/profile`)
  //   .then(res => {
      
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
  
  const handleSubmit = async (e) => {
    e.id = id
    await axios
      .post("/drive", e)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleCreateDrive = () => {
    if (title === "" || description === "") {
      toast.error("Please fill in all fields");
    } else {
      setShowConfirmationModal(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }
  };

  const confirmCreateDrive = () => {
    // Perform the actual fundraiser creation logic here

    submitData.title = title;
    submitData.description = description;

    handleSubmit(submitData);
    // After successful creation, close the modal and enable scrolling
    setShowConfirmationModal(false);
    document.body.style.overflow = "visible";

    navigate("/");
    toast.success("Drive created successfully");
  };

  return (
    <>
      <Navbar links={[{}]} />
      <section className="py-5">
        <div className="container">
          <div className="row row-cols-1 d-flex justify-content-center align-items-center mt-5 px-5">
            <div className="col text-center">
              <h2 className="display-3 fw-bold mb-4">
                Tell your own&nbsp;
                <span className="underline">Story</span>?
              </h2>
              <p className="fs-4 text-muted">
                Empower Your Narrative: Share Your Unique Story and Illuminate
                the Pathways of Inspiration.
              </p>
              <div className="mb-3 w-50 m-auto mt-5">
                <input
                  className="shadow-sm form-control"
                  type="text"
                  name="title"
                  placeholder="Your title"
                  style={{ fontWeight: "bold" }}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  className="shadow-sm form-control mt-4"
                  style={{ height: "200px", resize: "none" }}
                  type="description"
                  name="name"
                  placeholder="Your description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="container d-flex justify-content-between mt-5 m-auto fixed-bottom mb-5">
        <div className="nav-item" onClick={onPrev}>
          <a className="nav-link active">
            <ArrowLeft size={40} />
          </a>
        </div>
        <div className="nav-item">
          <button
            className="btn btn-primary rounded-pill shadow"
            type="button"
            onClick={handleCreateDrive}
          >
            Create Drive
          </button>
        </div>
      </footer>

      {/* Confirmation Modal */}
      <div
        className={`modal fade ${showConfirmationModal ? "show" : ""}`}
        id="confirmationModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{
          display: showConfirmationModal ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Confirm Drive Creation
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowConfirmationModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to create the drive with the given
              details?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmCreateDrive}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriveDesc;
