import axios from 'axios'
import "./Signup.css";
import { Link,useNavigate } from 'react-router-dom';
import {useForm} from "react-hook-form"
import toast,{Toaster} from 'react-hot-toast';
import { parseErrorMessage } from '../../components/ParseErrorMessage';

function Signup() {
  
  const {register,handleSubmit,formState:{errors},watch} = useForm();
  
  const navigate = useNavigate();

  const signup = (data) => {
      console.log(data)
      axios.post("/api/v1/users/register",data)
      .then((res)=> {
        toast.success("signed up successfully!");
        console.log(res)
        navigate("/dashboard")
      })
      .catch((err)=>{
        console.log(err)
        toast.error(parseErrorMessage(err.response.data))
      })
    }    

  // Watch password for validation of confirmPassword
  const password = watch('password');
  return (
    <div style={{maxHeight:'100vh',overflowY:"hidden"}}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <form 
      onSubmit={handleSubmit(signup)}
      className='signup'
      >
        <h3 >Signup</h3>
        <div className='cont1'>
          <div className="incont">
            <input name='fullName' placeholder='' type="text"  required {...register("fullName",{
              required:"Please enter your full name"
            })}/>
            <label>Full Name</label>
            {errors.fullName && (
              <span>{errors.fullName.message}</span>
            )}
          </div>
          <div className="incont">
            <input name='email' placeholder='' type="text" required {...register("email",{
              required:"Please Enter your email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email"
              }
            })}/>
            <label >Email</label>
            {errors.email && (
              <span>{errors.email.message}</span>
            )}
          </div>
          <div className="incont">
            <input name='password' placeholder='' type="password" required {...register("password",{
              required:"Please Enter the password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}/>
            <label>Password</label>
            {errors.password && (
              <span>{errors.password.message}</span>
            )}
          </div>
          <div className="incont">
            <input name='confirmPassword' placeholder='' type="password" required {...register("confirmPassword",{
              required:"Please Enter the password again",
              validate: value => value === password || "Passwords do not match"
            })}/>
            <label >Confirm Password</label>
            {errors.confirmPassword && (
              <span>{errors.confirmPassword.message}</span>
            )}
          </div>
        </div>
          <button type='submit'>Signup</button>
          <span>Already have an account?&nbsp;<Link to={"/signin"}>Signin</Link></span>
      </form>
    </div>
  )
}

export default Signup
