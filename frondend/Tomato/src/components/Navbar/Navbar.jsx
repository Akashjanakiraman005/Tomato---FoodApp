import React, { useContext, useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({setShowLogin}) => {
    const [menu , Setmenu] = useState("home")
    const [search, setSearch] = useState("");
    const {getTotalCartAmount,token,setToken, setSearchTerm} = useContext(StoreContext);
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }
    // Handle search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        if (setSearchTerm) setSearchTerm(e.target.value);
    }
    return (
    <div className="navbar">
     <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to ='/' onClick={()=>Setmenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href="#explore-menu" onClick={()=>Setmenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href="#app-download" onClick={()=>Setmenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href="#footer-app" onClick={()=>Setmenu("contact as")} className={menu === "contact as" ? "active" : ""}>contact as</a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-container">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={handleSearchChange}
            className="navbar-search-input"
          />
          <img src={assets.search_icon} alt="search" className="navbar-search-icon-img" />
        </div>
        <div className="navbar-search-icon">
           <Link to="/cart"><img src={assets.basket_icon} alt="" /></Link>
            <div className={getTotalCartAmount()===0? "":"dot"}></div>
        </div>
        {!token?
        <button onClick={()=>setShowLogin(true)}>sign in</button>
        : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
      </div>
        }
      </div>
    </div>
  )
}

export default Navbar
