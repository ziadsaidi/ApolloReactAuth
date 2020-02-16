import React,{SyntheticEvent} from 'react'
import {useState} from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';



export const Register: React.FC<RouteComponentProps> = ({history}) => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [register] = useRegisterMutation()

    const handleRegister = async  (e:SyntheticEvent)=>{
       e.preventDefault();
       const response = await register({
        variables:{
            email,
            password
        }
       })


       //if the Register passed navigate the user to the Home page 
       if(response.data?.register.ok === true){
           if(history)
              history.push("/");
       }
    
    
    }
        

    return (<form className='container' onSubmit={handleRegister}>
    <div className="form-group">
        <label>Email</label>
        <input type="email" 
        onChange = {(e)=>setEmail(e.target.value)}
        className="form-control" id="inputEmail" placeholder="Email" />
    </div>
    <div className="form-group">
        <label>Password</label>
        <input 
        onChange={(e)=> setPassword(e.target.value)}
        type="password" className="form-control" id="inputPassword" placeholder="Password" />
    </div>
    <div className="form-group">
        <label className="form-check-label">
            <input type="checkbox" /> 
            Remember me
     </label>
    </div>
    <button type="submit" className="btn btn-primary" >Register</button>
</form>)
}