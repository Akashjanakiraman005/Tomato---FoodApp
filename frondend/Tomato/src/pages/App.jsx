import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import {Route, Routes } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import Home from './Home/Home'
import Cart from './Cart/Cart'
import PlaceOrder from './PlaceOrder/PlaceOrder'
import Footer from '../components/Footer/Footer'
import LoginPopup from '../components/LoginPopup/LoginPopup'
import Verify from './Verify/Verify'
import MyOrders from './MyOrders/MyOrders'
import TrackOrder from './MyOrders/TrackOrder'

const App = () => {

const [showLogin, setShowLogin] = React.useState(false);
const location = useLocation();
const navigate = useNavigate();

React.useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('login') === 'true') {
    setShowLogin(true);
    navigate('/', { replace: true });
  }
}, [location.search, navigate]);

  return (
    <>
    {showLogin? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
         <div className="app">
      <Navbar setShowLogin={setShowLogin} />
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/trackorder' element={<TrackOrder />} />
              </Routes>
     
    </div>
     <Footer />
    </>
  )
}

export default App