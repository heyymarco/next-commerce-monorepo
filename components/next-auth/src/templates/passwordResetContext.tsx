// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from '../hooks/mock-context.js'



// contexts:
export interface PasswordResetApi {
    // data:
    url : string
}
const PasswordResetContext = createContext<Partial<PasswordResetApi>>({
});



// hooks:
export const usePasswordResetContext = () => {
    return useContext(PasswordResetContext);
};



// react components:
export interface PasswordResetContextProviderProps {
    // data:
    url : string
}
export const PasswordResetContextProvider = (props: React.PropsWithChildren<PasswordResetContextProviderProps>): JSX.Element|null => {
    // jsx:
    return (
        <PasswordResetContext.Provider value={{ url: props.url }}>
            {props.children}
        </PasswordResetContext.Provider>
    );
};
