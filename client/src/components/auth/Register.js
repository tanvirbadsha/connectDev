import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData ] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
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
  const { name, email, password, password2 } = formData;
  const onSubmit = async (event)=>{
    event.preventDefault();
    if(formData.password !== formData.password2){
      console.log('Password do not match');
    }else{
      console.log('sucess');
    }
  }
  return (
    <Fragment>
        <section className="container">
          <h1 className="large text-primary">Sign Up</h1>
          <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
          <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
              <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleInput} required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email Address" value={formData.email} onChange={handleInput} name="email" />
              <small className="form-text"
                >This site uses Gravatar so if you want a profile image, use a
                Gravatar email</small
              >
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
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={formData.password2}
                onChange={handleInput}
                minLength="6"
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Register"  />
          </form>
          <p className="my-1">
            Already have an account? <Link to='/login'>Sign In</Link>
          </p>
      </section>
    </Fragment>
  )
}

export default Register