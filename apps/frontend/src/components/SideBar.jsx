import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useChatStore } from '../lib/chatStore';
import '../modules/pages/home.css';

function GetAllUsers() {
  const [users, setUsers] = useState([]);
  const { selectedUser, setSelectedUser, authUser } = useChatStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/allUsers', { withCredentials: true });
        setUsers(res.data || []);
      } catch (err) {
        console.error('Error fetching users:', err.response?.data || err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="side-users-container">
      <h2 className='user-title'>Members</h2>
      <ul className="side-users">
        {users
          .filter((user) => user._id !== authUser?._id)
          .map((user) => (
            <li
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={selectedUser?._id === user._id ? 'selected' : ''}
            >
              <span>{user.username}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default GetAllUsers;
