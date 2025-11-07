import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';
import './login.css';

const LOGIN_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/login', {username, password });
      if( res.data?.token ){
        localStorage.setItem('user', JSON.stringify(res.data.user))
        setLoggedIn(true);
        console.log('Succesfully Logged In');
        alert('Succesfully Logged In');


      } else {
        alert ('Login Failed: token not received');
      }

    } catch (err) {
      console.error('Error Login', err);
      alert('Invalid username and password')
    }
  }

    useEffect(() => {
    if (loggedIn) {
      const timer = setTimeout(() => {
        navigate('/home'); // redirect to home page
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loggedIn, navigate]);

  return (
    <div >
      <div className='login-page'>
        <h1 className='title-login'> Login </h1>
        <form className='login-form' onSubmit={handleLogin}> 
          <input className='in-log' name='username' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required  />
          <input  className='in-log' name='password' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
          <button className='btn' type='submit'>Submit</button>

        </form>
      </div>
    </div>
  );
}

export default Login;