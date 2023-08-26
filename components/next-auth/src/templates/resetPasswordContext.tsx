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
export interface ResetPasswordApi {
    // data:
    url : string
}
const ResetPasswordContext = createContext<Partial<ResetPasswordApi>>({
});



// hooks:
export const useResetPasswordContext = () => {
    return useContext(ResetPasswordContext);
};



// react components:
export interface ResetPasswordContextProviderProps {
    // data:
    url : string
}
export const ResetPasswordContextProvider = (props: React.PropsWithChildren<ResetPasswordContextProviderProps>): React.ReactNode => {
    // jsx:
    return (
        <ResetPasswordContext.Provider value={{ url: props.url }}>
            {props.children}
        </ResetPasswordContext.Provider>
    );
};
