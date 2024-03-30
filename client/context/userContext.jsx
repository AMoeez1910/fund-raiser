import axios from 'axios'
import { createContext,useState,useEffect } from 'react'
export const UserContext = createContext({})
export function UserContextProvider({children}){
    const [user,setUser] = useState(null);
    // if user or not
    useEffect(()=>{
    if(!user){
        axios.get('https://fund-raiser-production.up.railway.app/profile')
        .then(res => {
          if(res.data)
            setUser(res.data)
          })
}
    },[user])
    return (
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}