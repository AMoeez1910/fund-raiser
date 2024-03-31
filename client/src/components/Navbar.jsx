import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from '../assets/logo.png';
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Links from "./Links";
import { UserContext } from "../../context/userContext";

export default function Navbar({links,getLoggedIn  }) {
  const navigate = useNavigate();
  const [user,setUser] = useState(false)
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name,setName] = useState("")
  //logic for sign in
 
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
  }, [setUser]);
  const logout = () => {
    axios.get('https://fund-raiser-production.up.railway.app/logout').then(res=>{
    if(res.data)
    {if(res.data.Status === "Success"){
      localStorage.removeItem("userData"); // Remove user data from local storage
      setUser(null);
      location.reload(true)
      toast.success("Succesfully logged out");
      
    }}
    }).catch(err=> console.log(err))
  };

  return (
    <nav
      id="mainNav"
      className="navbar navbar-expand-md fixed-top navbar-shrink py-3 navbar-light"
    >
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src={logo} style={{ width: "100px" }} alt="Logo"></img>
        </a>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navcol-1"
        >
          <span className="visually-hidden">Toggle navigation</span>
          <span className="navbar-toggler-icon" />
        </button>
        <div id="navcol-1" className="collapse navbar-collapse">

          <ul className="navbar-nav mx-auto">
            <Links hrefs={links} />


            {user ? (
              <li className="nav-item ">
                <a className="nav-link active" href="/profile">
                  Hello {user.name}!
                </a>
              </li>
            ) : (
              <></>
            )}
          </ul>
          {user ? (
            links[links.length - 1].button === true ? (
            <button
              className="btn btn-primary shadow rounded-pill"
              onClick={logout}
              type="button"
            >
              Logout
            </button>):(<></>)
          ) : (
              links[links.length - 1].button === true ? (
            <button
              className="btn btn-primary shadow rounded-pill"
              onClick={() =>
                navigate({
                  pathname: links[links.length - 1].path,
                  state: { from: window.location.pathname },
                })
              }
              type="button"
            >
              {links[links.length - 1].btn_name}
            </button>):(<></>)
          )}
        </div>
      </div>
    </nav>
  );
}
