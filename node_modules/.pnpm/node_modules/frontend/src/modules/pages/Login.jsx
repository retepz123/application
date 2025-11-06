import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';

const LOGIN_URL = `${import.meta.env.BACKEND_URL}/api/auth/login`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', {username, password });
      if( res.data?.token ){
        localStorage.setItem('token', res.data.token);
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
        navigate('/'); // redirect to home page
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loggedIn, navigate]);


  return (
    <div>
      <div>
        <h1> Login </h1>
        <form onSubmit={handleLogin}> 
          <input name='username' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required  />
          <input name='password' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
          <button type='submit'>Submit</button>

        </form>
      </div>
    </div>
  );
}

export default Login;