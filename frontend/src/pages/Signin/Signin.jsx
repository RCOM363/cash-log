import {useState} from 'react'
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import "./Signin.css"
import { useForm } from 'react-hook-form';
import toast,{Toaster} from "react-hot-toast";
import { parseErrorMessage } from '../../components/ParseErrorMessage';

function Signin() {

  const {register,handleSubmit,formState:{errors}} = useForm();

  const navigate = useNavigate();

  const signin = (data) => {
    console.log(data)
    axios.post("/api/v1/users/login",data)
      .then((res)=> {
        console.log(res)
        toast.success("signed in successfully!");
        navigate("/dashboard")
      })
      .catch((err)=> {
        console.log(err)
        toast.error(parseErrorMessage(err.response.data))
      })
  }

  
  return (
    <>
      <Toaster
      position="top-center"
      reverseOrder={false}
      />
      <form
      className='signin' 
      onSubmit={handleSubmit(signin)} >
        <h3>Signin</h3>
        <p>Enter your information to signin</p>
        <div className='cont1'>
          <div className='incont'>
            <input name="email" placeholder='' type="text" required {...register("email",{
              required:"Please enter your email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email"
              }
            })}/>
            <label>Email</label>
            {errors.email && (
              <span>{errors.email.message}</span>
            )}
          </div>
          <div className='incont'>
            <input name="password" 
            type="password" placeholder='' required {...register("password",{
              required:"Please enter your password"
            })}/>
            <label>Password</label>
            {errors.password && (
              <span>{errors.password.message}</span>
            )}
          </div>
        </div>
        <button type='submit'>Login</button>
        <span>Don&apos;t have an account?&nbsp;<Link to={"/signup"}>Signup</Link></span>
      </form>
    </>
  )
}

export default Signin
