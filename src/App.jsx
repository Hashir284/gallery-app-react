import React, { useEffect, useState } from 'react'
import Home from './Pages/Home';
import UpdateProfile from './Pages/UpdateProfile';
import { Navigate, Routes, Route } from 'react-router';
import Signup from './Pages/Signup';
import { auth, onAuthStateChanged, signOut } from './initialize';
import Login from './Pages/Login';
import Forget from './Pages/Forget';
import Loading from './Pages/Loading';

const App = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(null);
  
  useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          setUserLoggedIn(true);
          // ...
        } else {
          setUserLoggedIn(false);
          // User is signed out
          // ...
        }
      });
      console.log(1);
      
  }, []);

  const change = () => {
    signOut(auth)
      .then(() => {
        setUserLoggedIn(false);
      })
      .catch((err) => {        
        console.log("error", err);
      });
  };

  if (userLoggedIn === null) {
    return (<Loading />)
  }
 
  return (
    <div className="App bg-slate-950 text-slate-100  max-width-1400px bg-loginbg w-full ">
        {userLoggedIn ? (
        <Routes>
          <Route path="/home" element={<Home change={change} />} />
          <Route path="/UpdateProfile" element={<UpdateProfile />} />
          <Route path="*" element={<Navigate to={"/home"} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      )}
      </div>
  )
}

export default App
