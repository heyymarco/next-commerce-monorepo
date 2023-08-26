// react:
import {
    // react:
    default as React,
}                           from 'react'

// models:
import type {
    User,
}                           from '@prisma/client'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.js'



// contexts:
const UserContext = createContext<Partial<Omit<User, 'createdAt'|'updatedAt'|'emailVerified'>>>({
});



// hooks:
export const useUserContext = () => {
    return useContext(UserContext);
};



// react components:
export interface UserContextProviderProps {
    // models:
    model : Partial<User>
}
export const UserContextProvider = (props: React.PropsWithChildren<UserContextProviderProps>): React.ReactNode => {
    // jsx:
    return (
        <UserContext.Provider value={props.model}>
            {props.children}
        </UserContext.Provider>
    );
};
