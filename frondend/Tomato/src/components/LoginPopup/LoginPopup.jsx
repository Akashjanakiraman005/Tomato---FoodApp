import React from 'react'
import './LoginPopup.css'
import {assets} from '../../assets/assets';
import { useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';

const LoginPopup = ({setShowLogin}) => {
        
    const {url, setToken} = React.useContext(StoreContext);

    const [currState, setCurrState] = React.useState('login');
    const [data, setData] = React.useState({
        name:"",
        email:"",
        password:""
    });
      const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data=>({...data, [name]:value}));
      }

      const onLogin = async (e) => {
        e.preventDefault();
                const payload = {
                    ...data,
                    name: data.name.trim(),
                    email: data.email.trim().toLowerCase(),
                };

        let newUrl = url;
        if(currState==="login"){
            newUrl+="/api/user/login";
        }else{
            newUrl+="/api/user/register";
        }

        const response = await fetch(newUrl, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload)
        });
        const res_data = await response.json();
        if(res_data.success){
            localStorage.setItem("token", res_data.token);
            setToken(res_data.token);
            setShowLogin(false);
            setData({name:"",email:"",password:""});
        } else{
            alert(res_data.message);
        }



      }
      

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState }</h2>
                <img  onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-input">
                {currState==="login"?<></>:  <input type="text" name="name" onChange={onChangeHandler} value={data.name} placeholder='your name' required  />}
              
                <input type="email" name="email" onChange={onChangeHandler} value={data.email} placeholder='your email' required />
                <input type="password" name="password" onChange={onChangeHandler} value={data.password} placeholder='your password' required />
                <button type='submit'>{currState==="signup"?"Create account":"Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>I agree to the Terms of Service and Privacy Policy</p>
                </div>
                {currState==="login"?
                <p>Create account ? <span onClick={()=>setCurrState("signup")}>Sign up</span></p>
                :<p>Already have an account? <span onClick={()=>setCurrState("login")}>Login</span></p>  }
            </div>
        </form>
    </div>
  )
}

export default LoginPopup
