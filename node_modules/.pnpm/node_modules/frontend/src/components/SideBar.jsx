import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { useChatStore } from '../lib/chatStore';

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
    <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul className="space-y-2">
        {users
          .filter((user) => user._id !== authUser?._id) // hide yourself
          .map((user) => (
            <li
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-2 rounded-lg cursor-pointer transition ${
                selectedUser?._id === user._id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {user.username}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default GetAllUsers;
