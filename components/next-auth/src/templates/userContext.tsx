// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import type {
    // models:
    AdapterUser,
}                           from 'next-auth/adapters'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.js'



// contexts:
const UserContext = createContext<Partial<AdapterUser>>({
});



// hooks:
export const useUserContext = () => {
    return useContext(UserContext);
};



// react components:
export interface UserContextProviderProps {
    // models:
    model : Partial<AdapterUser>
}
export const UserContextProvider = (props: React.PropsWithChildren<UserContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <UserContext.Provider value={props.model}>
            {props.children}
        </UserContext.Provider>
    );
};
