import React from 'react'
import {SyntheticEvent} from 'react'
import {useState} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { setAccessToken } from '../acessToken';
import { useAlert } from 'react-alert'
 



export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [login] = useLoginMutation()
    const alert = useAlert();



    const handleLogin =async  (e:SyntheticEvent)=>{
       e.preventDefault();


       try{
        const {data} = await login({
            variables:{
                email,
                password
            },
            update(store,{data}){
                if(!data){
                    return null;
                }
                //update apollo Cache
                store.writeQuery<MeQuery>({
                    query:MeDocument,
                    data:{
                        __typename:'Query',
                        me:data.login.user
                    
                    }
                })
            }
        })

       const token = data?.login.accessToken;
       setAccessToken(token!);
       if(token){
           history.push('/');
       }


       }
       catch(err){
           alert.show("Login failed !")
           console.log(err)
       }

     
    }
        

    return (<form className='container' onSubmit={handleLogin}>
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
    <button type="submit" className="btn btn-success" >Login </button>
</form>)
}