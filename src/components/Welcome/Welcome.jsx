import React, { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import signInIcon from '../../assets/icon--signin.png'
import signUpIcon from '../../assets/icon--signup.png'
import './welcome.css'

const Welcome = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  })

  const navigate = useNavigate();

 useEffect(() => {
  auth.onAuthStateChanged((user) => {
    if(user) navigate('/homepage');
  })
 }, []);

 const handleEmailChange = (e) => {
  setEmail(e.target.value);
 }
 const handlePasswordChange = (e) => {
  setPassword(e.target.value);
 }

 const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      navigate('/homepage')
      console.log(auth);
    }).catch((err) => alert(err.message));
 }

 const handleRegister = () => {
    if(registerInfo.email !== registerInfo.confirmEmail){
      alert("📢 The emails don't match!")
    } else if ( registerInfo.password !== registerInfo.confirmPassword) {
        alert("📢 The passwords don't match!")
      } else {
        createUserWithEmailAndPassword(auth, registerInfo.email, registerInfo.password)
        .then(() => {
          navigate('/homepage');
        })
        .catch((err) => alert(err.message));
      }
 }

  return (
    <div className="welcome">
      <h1>I.T.S. Todo-List</h1>
      <div className='login-register-wrap'>
        {isRegistering ? (
        <>

          <div className='input-wrap'>
          <div className='new-account--input-wrap'>
            <input type="email"  placeholder={'email'}
             value={registerInfo.email}
              onChange={(e) =>
                setRegisterInfo(
                  {...registerInfo, email: e.target.value})}
                  />
              <input type="email"  placeholder={'confirm email'}
               value={registerInfo.confirmEmail}
               onChange={(e) =>
                setRegisterInfo(
                  {...registerInfo, confirmEmail: e.target.value})}
                  />
          </div>
            <div className='new-account--input-wrap'>
              <input type="password"  placeholder={'password'}
               value={registerInfo.password}
               onChange={(e) =>
                setRegisterInfo(
                  {...registerInfo, password: e.target.value})}
                  />
              <input type="password" placeholder={'confirm password'}
               value={registerInfo.confirmPassword}
               onChange={(e) =>
                setRegisterInfo(
                  {...registerInfo, confirmPassword: e.target.value})}
                  />
            </div>
            </div>
            <div className="btn-wrap">
              <button className='btn-signup'  onClick={handleRegister}><img src={signUpIcon} alt="" /></button>
              <button className='btn-link'  onClick={() => setIsRegistering(false)}>Already have an account?</button>
            </div>
        </>
        
        
        ) : (
        <>
          <div className="input-wrap">
            <input type="email" placeholder='email...' onChange={handleEmailChange} value={email}/>
            <input type="password" placeholder='password...' onChange={handlePasswordChange} value={password}/>
          </div>
          <div className="btn-wrap">
            <button className='btn-signup' onClick={handleSignIn}><img src={signInIcon} alt="" /></button>
            <button className='btn-link' onClick={() => setIsRegistering(true)}>Create new account</button>
          </div>

        </>
        )}
      </div>
    </div>
  )
}

export default Welcome