import './App.css'
import {Toaster} from 'react-hot-toast'
import {Routes,Route} from 'react-router-dom'
import Navbar from '../src/components/Navbar'
import Home from '../src/pages/Home'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import EmailVerify from './pages/EmailVerify'
import MaybeShowNavbar from './components/MaybeShowNavbar'
import axios from 'axios'
import { UserContextProvider } from '../context/userContext'
axios.defaults.baseURL = 'http://localhost:8000'
// connect to local host
axios.defaults.withCredentials = true
function App() {

  return (
  <>
  <UserContextProvider>
    <MaybeShowNavbar>
  <Navbar />
  </MaybeShowNavbar>
  <Toaster position='bottom-right' toastOptions={{duration: 2000}}/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/verify/:id/:expirationTimestamp' element={<EmailVerify/>}/>
    </Routes>
    </UserContextProvider>
  </>

  )
}

export default App
