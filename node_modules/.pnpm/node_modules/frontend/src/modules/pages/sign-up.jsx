import { useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
      const res = await axiosInstance.post('/auth/register', formData); 
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-80 p-6 bg-white shadow-lg rounded-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>

        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border rounded p-2"
        />

        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="border rounded p-2"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border rounded p-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition"
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        {message && (
          <p
            className={`mt-2 text-center ${
              message.includes('Created') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </form>
      <Link to='/login'>Login</Link>
    </div>
  );
}

export default SignUp;
