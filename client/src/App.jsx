import './App.css'
import {Toaster} from 'react-hot-toast'
import {Routes,Route} from 'react-router-dom'
import Home from '../src/pages/Home'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import EmailVerify from './pages/EmailVerify'
import FundRaiser from './pages/FundRaiser'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import CreateVolunteer from './pages/CreateVolunteer'
import VolunteerPage from './pages/VolunteerPage'
import Profile from './pages/Profile'
import axios from 'axios'
import { UserContextProvider } from '../context/userContext'
import Donate from './pages/Donate'
axios.defaults.baseURL = `https://fund-raiser-production.up.railway.app`
axios.defaults.withCredentials = true;
import "../../client/src/index.css";
import "../../client/src/bootstrap.js";
import CheckoutSuccess from './pages/CheckoutSuccess'

// connect to local host
function App() {

  return (
    <>
      <UserContextProvider>
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/verify/:id/:expirationTimestamp"
            element={<EmailVerify />}
          />
          <Route path="/fundraiser" element={<FundRaiser />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route
            path="/ForgotPassword/:id/:token"
            element={<ForgotPassword />}
          />
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/fundraiser/donate/:fid" element={<Donate />} />
          
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/createvolunteer" element={<CreateVolunteer />} />
          <Route path="/drive/volunteer/:did" element={<VolunteerPage />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App