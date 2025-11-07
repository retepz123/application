import { BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './modules/pages/sign-up';
import Home from './modules/pages/Home';
import Login from './modules/pages/Login';
import { useAuthStore } from './lib/authStore';
import { useEffect } from 'react';

function App() {
    const { checkAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth(); // ✅ check session once when the app loads
  }, []);

  console.log("Auth User:", authUser);


  return (
    <BrowserRouter>
    <Routes>
     <Route element={<SignUp />} path='/' />
      <Route element={<Home />} path='/home' />
      <Route element={<Login />} path='/login' />
    </Routes>
    </BrowserRouter>
  );
}

export default App;