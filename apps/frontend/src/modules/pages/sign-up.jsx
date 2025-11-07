import { useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../App.css';
import logo from '../../image/logo.png';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/register', formData); 
      setMessage(res.data.message);
      console.log('✅ User Created Successfully:', res.data);

      //redirect to login page
      setTimeout(() => 
        navigate('/login'), 1000
      );

    } catch (err) {
      console.error('❌ Sign Up Error:', err);
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main'>
     <div>
      <div className='signup-container'>
         <form className='form'
        onSubmit={handleSubmit}
        
      >
        <h1 className="title">Sign Up</h1>

        <div className='input'>
             <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="data"
        />

        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="data"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="data"
        />

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

       {message && (
  <p className={`alert ${message.includes('Created') ? 'success' : 'error'}`}>
    {message}
  </p>
)}
        </div>

     
      </form>
      <div className='tagline'>
        <div>
          <img src={logo} alt='logo' className='logo' />
        </div>
        <div className='text'>
          Welcome to our community — where every conversation counts, friendships flourish, and your voice is heard. Dive in, connect, and make every chat meaningful!
        </div>
     <Link to='/login' className='login-btn'>Login</Link>

      </div>

      </div>

     </div>

    </div>
  );
}

export default SignUp;
