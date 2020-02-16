import React, { useState, useEffect } from 'react'
import { useUsersQuery, useDeleteUserMutation, User, useDeleteAllUsersMutation, UsersQuery } from '../generated/graphql';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { RouteComponentProps } from 'react-router-dom';
import Loader   from 'react-loader-spinner';




export const Home: React.FC<RouteComponentProps> = ({history}) => {



    const {data,error,refetch} = useUsersQuery();
    const [deleteUser]  = useDeleteUserMutation();
    const [deleteAllUsers] = useDeleteAllUsersMutation()



    if(error){
        return <div className="container">
            <h1> Make sure to login to our website!!</h1>
        </div>
    }


    if(!data){
       
        return   <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={100}
        width={100}
     />
    }

   

    const handleUserDelete = async (userId:number)=>{
       const {data} = await deleteUser({
           variables:{
               userId
           }
       });
       if(data?.deleteUser){
           //use the apollo Refetch method ::cool
           refetch();
           //How can I refresh my componnet
           //first way use javaScript
           //this is not a good way to refresh an app
           //window.location.reload(false);
           //second way use state
       }

    }


    const handleDeleteAllUsers= async ()=>{
        const {data} = await deleteAllUsers();
        if(data?.deleteAllUsers){
            refetch();
        }
    }

    return <div className='container'>
        <ul className="list-group">
        { data.users.length === 0 ? <h1> No User Found</h1>: data.users.map((user:User)=>{
            return  <li  
            key={user.id} className="list-group-item">{
            user.email}
             <FontAwesomeIcon onClick={()=>handleUserDelete(user.id)} style={{
                    float: 'right',
                    
             }} color='red' icon="trash" />
            </li>
           

        })}
</ul>
<br />
<button  onClick={handleDeleteAllUsers} className='btn btn-outline-danger'> Clear all users</button>
     

    </div>
}