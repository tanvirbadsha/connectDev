import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import  Landing  from './components/layouts/Landing';
import  Navbar  from './components/layouts/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

const App = ()=> {
  return (
    <Router>
      <>  {/* fragments er shorter version <Fragment> */}
        <Navbar />
        <Routes>
          <Route  path="/" element={< Landing />} />
        </Routes>
        <section className="container">
            <Routes>
              <Route  path="/register" element={< Register />} />
              <Route  path="/login" element={< Login />} />
            </Routes>
        </section>
      </>
    </Router>
  );
}

export default App;
