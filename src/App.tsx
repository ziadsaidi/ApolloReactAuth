import React,{useState,useEffect} from 'react'
import { Routes } from './Routes'
import Loader   from 'react-loader-spinner';
import { setAccessToken } from './acessToken';

interface AppProps {

}

export const App: React.FC<AppProps> = ({}) => {

    const [loading,setLoading ] = useState(true);


    useEffect(()=>{

        fetch('http://localhost:4000/refresh_token',{
          method:'POST',
          credentials:'include'
        })
        .then(res =>res.json())
        .then (data =>{
          const {accessToken} = data;
          setAccessToken(accessToken);
          setLoading(false);
        })


    },[])


    if(loading){
      return   <Loader
         type="ThreeDots"
         color="#00BFFF"
         height={100}
         width={100}

      />
    }
        return <Routes />
}