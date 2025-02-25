import React from 'react'
import './LoginSignup.css'

const LoginSignup = () => {
  return (
    <div className='container'>
        <div classname="header">
            <div className="text">Sign Up</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <i className="fa-solid fa-user"></i>
                <input type="text" />
            </div>
        </div>
        <div className="inputs">
            <div className="input">
                <i className="fa-solid fa-envelope"></i>
                <input type="email" />
            </div>
        </div>
        <div className="inputs">
            <div className="input">
                <i className="fa-solid fa-lock"></i>
                <input type="password" />
            </div>
        </div>
        <div className="forgot-password">forgot password? <span>Click Here!</span></div>
        <div className="submit-container">
            <div className="submit">Sign Up</div>
            <div className="submit">Login</div>
        </div>
    </div>
  )
}

export default LoginSignup