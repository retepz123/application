import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/allUsers');
        setUsers(res.data || []);
      } catch (err) {
        console.error('Error fetching users:', err.response?.data || err.message);
      }
    };

    fetchUsers(); 
  }, []);


  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default GetAllUsers;