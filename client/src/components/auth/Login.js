import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData ] = useState({
    email: '',
    password: ''
  });
  const handleInput = (e)=>{
    const {name, value } = e.target;
    setFormData(prevValue=>{
      return{
        ...prevValue,
        [name]: value
      }
    })
  }
  const { email, password } = formData;

  const onSubmit = async (event)=>{
    event.preventDefault();
    console.log('sucess');
  };

  return (
    <Fragment>
        <section className="container">
          <h1 className="large text-primary">Sign in</h1>
          <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
          <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <input type="email" placeholder="Email Address" value={formData.email} onChange={handleInput} name="email" />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInput}
                minLength="6"
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Login"  />
          </form>
          <p className="my-1">
            Don't have an account? <Link to='/register'>Register</Link>
          </p>
      </section>
    </Fragment>
  )
}

export default Login
