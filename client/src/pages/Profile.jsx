import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from 'mdb-react-ui-kit';
import profilePhoto from '../assets/profile.png'
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
export default function Profile() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setID] = useState();
  const [payment, setPayment] = useState();
  const [fundraise, setfundraise] = useState();
  const [drive, setdrive] = useState();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/getUserInfo/${id}`);
        setPayment(response.data.payment);
        setfundraise(response.data.createdFundraise);
        setdrive(response.data.createdDrive);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    axios.get('https://fund-raiser-production.up.railway.app/profile').then((res) => {
      if (res.data.Status === 'Success') {
        setIsLoggedIn(true);
        setName(res.data.name);
        setEmail(res.data.email);
        setID(res.data.id);
      } else {
        setIsLoggedIn(false);
      }
    }).catch(error => {
      toast.error("Login Please"); 
      // Redirect to login page
      navigate('/login'); // Adjust the route as per your application setup
    });;
  }, [isLoggedIn]);

  return (
    <>
    <Navbar links={[{ button: true, path: "/", btn_name: "Logout" }]}/>
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5 ">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4 mt-5">
              <MDBBreadcrumbItem>
                <a href='#'>Home</a>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem>
                <a href="#">User</a>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            

            <MDBCard className="mb-4 sticky-top" style={{top:100}}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="4">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="8">
                    <MDBCardText className="text-muted">{name}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="4">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="8">
                    <MDBCardText className="text-muted">{email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="4">
                    <MDBCardText>User Id</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="8">
                    <MDBCardText className="text-muted">{id}</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol lg="8">
            <MDBRow style={{ marginBottom: '15px' }}>
              <MDBCol md="12">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Payment History</MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>
                      {payment &&
                        payment.map((key, idx) => (
                          <div key={idx}>
                            <p className='fw-bold'>{key.title}</p>
                            <p >Date : {new Date(key.paymentDate).toLocaleString("en-US", {
                                                timeZoneName: "short",
                                            })}</p>
                            <p>Amount Paid : $ {key.amount}</p>
                            <hr />
                          </div>
                        ))}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>


            </MDBRow>

            <MDBRow>
              <MDBCol md="12">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Campaigns Created</MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>{fundraise &&
                        fundraise.map((key, idx) => (
                          <div key={idx}>
                            <p className='fw-bold'>{key.title}</p>
                            <p >Start Date : {new Date(key.startDate).toLocaleString("en-US", {
                                                timeZoneName: "short",
                                            })}</p>
                            <p>Goal Amount : $ {key.goalAmount}</p>
                            <hr />
                          </div>
                        ))}</MDBCardText>
                    </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">Drives Started</MDBCardText>
                    <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>{drive &&
                        drive.map((key, idx) => (
                          <div key={idx}>
                            <p className='fw-bold'>{key.title}</p>
                            <p >Start Date : {new Date(key.startDate).toLocaleString("en-US", {
                                                timeZoneName: "short",
                                            })}</p>
                            <p>Location : {key.location}</p>
                            <hr />
                          </div>
                        ))}</MDBCardText>
                    </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
    </>
  );
}