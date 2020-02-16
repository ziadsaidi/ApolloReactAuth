import React from 'react';
import ReactDOM from 'react-dom';

//import CSS
import 'bootstrap/dist/css/bootstrap.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


//import font-awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import {faTrash,faUser} from '@fortawesome/free-solid-svg-icons'


import {ApolloProvider} from'@apollo/react-hooks'
import { getAccessToken, setAccessToken } from './acessToken';
import { App } from './App';



//apollo config
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from  'jwt-decode';


//import react alert 
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE
}
library.add(faTrash,faUser)

const cache = new InMemoryCache({});


// request Link
const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle: any ;
    Promise.resolve(operation)
      .then((operation)=>{

          const accessToken= getAccessToken();
          if(accessToken){
            operation.setContext({
              headers:{
                authorization:`bearer ${accessToken}`
              }
      
            }) } } )
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch((err)=>{
        console.log(err)

      });

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

//setup apollo Client 
const client = new ApolloClient({

  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField:'accessToken',
      isTokenValidOrUndefined: () => {

        const token = getAccessToken();
        if(!token){
          return true;
        }
        try{
          //decode Our Token and extract the expiration date
          const {exp} = jwtDecode(token);

          if(Date.now() >= exp*1000){
            return false;
          }
          return true;
        }
        catch(err){
          return false;
        }
      },
      fetchAccessToken: () => {
        return fetch('http://localhost:4000/refresh_token',{
          method:'POST',
          credentials:'include'
        })
      },
      handleFetch: accessToken => {
       setAccessToken(accessToken);
      },
      handleError: err => {
        // full control over handling token fetch Error
        console.warn('Your refresh token is invalid. Try to relogin');
        console.error(err);
      }
    }),
    requestLink,
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include'
    })
  ]),
  cache
});


ReactDOM.render(
<ApolloProvider client={client}>
<AlertProvider template={AlertTemplate} {...options}>
  <App />
  </AlertProvider>
</ApolloProvider>
, document.getElementById('root'));

