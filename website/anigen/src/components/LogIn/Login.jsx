import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const Login = () => {
  const history=useNavigate();
  const [user,setUser] = useState({
    email:"",
    password:""
  })
  const handleChange=e=>{
    const {name,value}=e.target
    setUser({

      ...user,
      [name]: value
    })
  }
  useEffect(()=>{
    const auth=localStorage.getItem("user")
    if(auth){
      history("/home")
    }
  })
  const logInUser = () =>{
    axios.post("http://localhost:4000/login",user)
    .then( res => {
      if(res.data.message==='LogIn successful'){
        localStorage.setItem("user",res.data.user)
        localStorage.setItem("name",res.data.user.email)
        history("/home",{state:{id:res.data.user.name}})
        history(0)
      }
    })
  }
  return (
    <div>
    {console.log("User",user)}
      <div className="container shadow my-5">
        <div className="row">
        <div className="col-md-6">
          <img src="/assets/login.jpg" alt="Contact" className="w-75"/>
        </div>
          <div className="col-md-6 p-5">
          <h1 className="display-6 fw-bolder mb-5">Log In</h1>
          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" value={user.email} placeholder="Your Email" onChange={handleChange}/>
              <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
              </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword1" name="password" value={user.password} placeholder="Your Password" onChange={handleChange}/>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
              <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" class="btn btn-primary" onClick={logInUser}>Submit</button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
