import React from 'react'
import Hero from './Hero'
import Navbar from '../components/Navbar'
import ActiveCampaign from './ActiveCampaign';
import PastCampaign from './PastCampaign';
import Impact from './Impact'
import Volunteer from './Volunteer'
import StartFundraiser from './StartFundraiser';
import ActiveDrive from './ActiveDrive';
import Footer from './Footer';
import { useEffect,useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const updateFundraiseStatus = async () => {
      try {
        
         await axios.patch('/');
  
      } catch (error) {
        console.error('Error updating fundraise status:', error);
      }
    };
    updateFundraiseStatus();
  }, []);
  
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);
  return (
    <>
      <Navbar
        links={[
          { href: "/", name: "Home" },
          { href: "#donate", name: "Donate Now" },
          { href: "#past", name: "Past Campaigns" },
          { href: "#volunteer", name: "Volunteer" },
          { href: "#start", name: "Start a fundraiser" },
          {button: true, path: "/login", btn_name: "Login"}
        ]} getLoggedIn={setIsLoggedIn}
      />
      <Hero />
      <ActiveCampaign />
      <ActiveDrive />
      <Impact />
      <Volunteer loginDetail={isLoggedIn}/>
      <StartFundraiser loginDetail={isLoggedIn}  />
      <PastCampaign />
      <Footer />
    </>
  );
}
