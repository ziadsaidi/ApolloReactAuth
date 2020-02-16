import React from 'react'
import { useByeQuery } from '../generated/graphql';


export const Bye: React.FC = ({}) => {

    const {data,loading,error} = useByeQuery();
        
    if(loading){
       return  <div> Loading ...</div>
    }

    if(error){
        return null;
    }

    if(!data){
      return   <div> no data</div>
    }
    return <div className="container">

      <h1>
      {data.bye}
      </h1>
     
      </div>

}