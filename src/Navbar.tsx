
import React from 'react'
import {Link} from 'react-router-dom';
import { useMeQuery, useLogoutMutation, MeQuery, MeDocument, UsersDocument, UsersQuery } from './generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setAccessToken } from './acessToken';



export const Navbar: React.FC = ({}) => {

  const {data,loading} = useMeQuery();
  const [logout,{client}] = useLogoutMutation();



  const handleLogout = async ()=>{
    await logout({
      update(store,{data}){
        if(!data){
            return null;
        }
        //update apollo Cache

        /*
        store.writeQuery<UsersQuery>({
          query:UsersDocument,
          data:{
            __typename:'Query',
            users:[]

          }
          
        })
        store.writeQuery<MeQuery>({
            query:MeDocument,
            data:{
                __typename:'Query',
                me:null
            
            }
        })
        */

        // reset Appolo client
        client?.resetStore();
    }
   
    })
    setAccessToken('');

  }

        return  <nav className="navbar navbar-expand-sm bg-light">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bye" >bye</Link>
            </li>

            <li className="nav-item">
            <Link className="nav-link" to="/" >
            <FontAwesomeIcon icon="user" /> {data && data.me ?data.me.email:"Not Logged in "}

            </Link>
          </li>
          <li>
             {!loading && data && data.me ? <button className="btn btn-outline-info" onClick={handleLogout}> Logout </button>: null} 
          </li>
            
          </ul>
        </nav>
}